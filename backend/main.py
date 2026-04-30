from datetime import datetime

from fastapi import FastAPI

from config import settings
from schemas import UserResponse ## use this to import schemas



app = FastAPI(title="NutriFlow API")


def now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


@app.get("/")
def health_check():
    """Endpoint de verificação de ambiente."""
    key_loaded = bool(settings.gemini_api_key)
    return {"status": "ok", "gemini_key_loaded": key_loaded}


## Schema use example in api response. DO NOT LET THIS APPEAR IN PROD
@app.get("/example-user", response_model=UserResponse)
def get_example_user():
    """Simpler example route using UserResponse schema."""
    return UserResponse(
        id="123",
        email="example@example.com",
        name="Example User",
        created_at=now_iso()
    )
