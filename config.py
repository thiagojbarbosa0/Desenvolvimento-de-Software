from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    gemini_api_key: str
    database_url: str = "sqlite:///./nutriflow.db"
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
