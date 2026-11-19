from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuration read from environment variables (see ../.env.example)."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://sito:sito@db:5432/sito"

    # Single admin account: the password is stored only as a bcrypt hash
    admin_username: str = "admin"
    admin_password_hash: str = ""

    # Signs the session token; must be long and random in production
    secret_key: str = ""
    session_hours: int = 12
    secure_cookie: bool = True

    upload_dir: Path = Path("/data/uploads")
    max_upload_mb: int = 5


@lru_cache
def get_settings() -> Settings:
    return Settings()
