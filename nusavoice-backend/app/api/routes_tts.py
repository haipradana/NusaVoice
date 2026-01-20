import uuid
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from pathlib import Path

from app.schemas.tts import TTSRequest, TTSResponse
from app.utils.text import clean_text, count_words, estimate_duration_seconds
from app.core.config import settings
from app.services.limiter import SimpleRateLimiter
from app.services.piper_service import PiperService
from app.services.storage import Storage

tts_router = APIRouter()

limiter = SimpleRateLimiter(settings.rate_limit_per_hour)
piper = PiperService(settings.piper_bin, settings.model_dir)
storage = Storage(settings.output_dir, settings.audio_ttl_hours)

def get_client_ip(req: Request) -> str:
    # if later put behind reverse proxy, handle X-forwarded-for properly
    xff = req.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return req.client.host if req.client else "unknown"

@tts_router.post("/tts", response_model=TTSResponse)
async def tts(req: Request, payload: TTSRequest):
    ip = get_client_ip(req)
    allowed, retry_after = limiter.allow(ip)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Try again in {retry_after}s.",
            headers={"Retry-After": str(retry_after)},
        )

    text = clean_text(payload.text)
    words = count_words(text)
    chars = len(text)

    if words > settings.max_words:
        raise HTTPException(status_code=400, detail=f"Too many words. Max {settings.max_words}.")
    if chars > settings.max_chars:
        raise HTTPException(status_code=400, detail=f"Too many characters. Max {settings.max_chars}.")

    request_id = uuid.uuid4().hex
    out_path = storage.path_for(request_id)

    # optional cleanup (cheap)
    storage.cleanup_old_files()

    try:
        await piper.synthesize_wav(
            voice=payload.voice,
            text=text,
            out_path=out_path,
            speed=payload.speed,
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    return TTSResponse(
        request_id=request_id,
        audio_url=f"/audio/{request_id}.wav",
        voice=payload.voice,
        words=words,
        chars=chars,
        duration_estimate_sec=estimate_duration_seconds(words),
    )

@tts_router.get("/audio/{file_name}")
def get_audio(file_name: str):
    # file_name format: "<id>.wav"
    if not file_name.endswith(".wav"):
        raise HTTPException(status_code=400, detail="Only wav supported.")

    p = Path(settings.output_dir) / file_name
    if not p.exists():
        raise HTTPException(status_code=404, detail="Not found.")

    return FileResponse(
        path=str(p),
        media_type="audio/wav",
        filename=file_name,
    )