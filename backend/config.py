from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    gemini_api_key: Optional[str] = None

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
