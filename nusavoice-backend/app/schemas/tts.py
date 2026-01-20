from pydantic import BaseModel, Field
from typing import Literal

class TTSRequest(BaseModel):
    voice: Literal["female", "male"]
    text: str = Field(min_length=1, max_length=5000)
    speed: float = Field(default=1.0, ge=0.8, le=1.2) # ge adalah >= dan le adalah <=
    format: Literal["wav"] = "wav"

class TTSResponse(BaseModel):
    request_id: str
    audio_url: str
    voice: str
    words: int
    chars: int
    duration_estimate_sec: float