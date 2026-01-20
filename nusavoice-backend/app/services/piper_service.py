import asyncio
from pathlib import Path

class PiperService:
    def __init__(self, piper_bin: str, models_dir: str):
        self.piper_bin = piper_bin
        self.models_dir = Path(models_dir)
        
    def model_paths(self, voice:str) -> tuple[Path, Path]:
        base = self.models_dir / voice
        onnx = base / "model.onnx"
        cfg = base / "model.onnx.json"
        return onnx, cfg
    
    async def synthesize_wav(self, *, voice: str, text: str, out_path: Path, speed: float) -> None:
        onnx, cfg = self.model_paths(voice)
        if not onnx.exists():
            raise FileNotFoundError(f"missing model {onnx}")
        if not cfg.exists():
            raise FileNotFoundError(f"Missing config {cfg}")
        
        cmd = [
            self.piper_bin,
            "-m", str(onnx),
            "-c", str(cfg),
            "--output_file", str(out_path)
        ]
        
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        
        assert proc.stdin is not None
        proc.stdin.write(text.encode("utf-8"))
        await proc.stdin.drain()
        proc.stdin.close()
        
        _, stderr = await proc.communicate()
        if proc.returncode != 0:
            raise RuntimeError(f"piper failed: {stderr.decode('utf-8', errors='ignore')}")