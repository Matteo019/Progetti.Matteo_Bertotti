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

    # Contact form: every message is saved and shown in /admin.
    # If SMTP is configured, a copy is also emailed to notify_email.
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = ""
    notify_email: str = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()
