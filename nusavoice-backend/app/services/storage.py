import os
import time
from pathlib import Path

class Storage:
    def __init__(self, output_dir: str, ttl_hours:int):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.ttl_sec = ttl_hours*3600
        
    def path_for(self, request_id:str) -> Path:
        return self.output_dir / f"{request_id}.wav"
    
    def cleanup_old_files(self) -> int:
        # delete old wavs, return count deleted
        now = time.time()
        deleted = 0
        for p in self.output_dir.glob("*.wav"):
            try:
                if now - p.stat().st_mtime > self.ttl_sec:
                    p.unlink(missing_ok=True)
                    deleted += 1
            except OSError:
                pass
            
        return deleted