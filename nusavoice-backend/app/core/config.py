from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="NUVOICE_", env_file=".env", extra="ignore")

    host: str = "0.0.0.0"
    port: int = 8000

    # limits
    max_words: int = 120
    max_chars: int = 800
    rate_limit_per_hour: int = 100

    # piper - use Field alias to map env var names
    piper_bin: str = Field(default="/opt/piper/piper", alias="NUVOICE_PIPER_BIN")
    model_dir: str = Field(default="./models", alias="NUVOICE_MODEL_DIR")
    output_dir: str = Field(default="./output", alias="NUVOICE_OUTPUT_DIR")

    audio_ttl_hours: int = 1

settings = Settings()