from fastapi import FastAPI
from config import settings

app = FastAPI(title="NutriFlow API")


@app.get("/")
def health_check():
    """Endpoint de verificação de ambiente."""
    # Nunca exponha a chave real — apenas confirma que ela foi carregada
    key_loaded = bool(settings.gemini_api_key)
    return {"status": "ok", "gemini_key_loaded": key_loaded}
