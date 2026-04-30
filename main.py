from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from backend.config import settings
from backend.chat import responder_mensagem
from backend.db import authenticate, create_user, get_user_by_id, get_profile, upsert_profile, init_db
from backend.ai import generate_plan

app = FastAPI(title="NutriFlow API")

init_db()

# CORS — permite o Vite (porta 5173) chamar o FastAPI (porta 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────
# SCHEMAS
# ──────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str

class CadastroRequest(BaseModel):
    name: str
    email: str
    password: str

class PlanRequest(BaseModel):
    user_id: str
    age: int
    biological_sex: str
    height_cm: float
    weight_kg: float
    goal: str
    other_goal: Optional[str] = ""
    dcnt: Optional[str] = "Não"
    dcnt_details: Optional[str] = ""
    activity_level: str
    sleep_hours: float
    sleep_minutes: int
    stress_level: int
    motivations: Optional[str] = ""
    objective: Optional[str] = ""
    additional_details: Optional[str] = ""
    meal_preferences: Optional[str] = ""

class ChatRequest(BaseModel):
    mensagem: str
    user_id: Optional[str] = None


# ──────────────────────────────────────────
# HEALTH
# ──────────────────────────────────────────

@app.get("/")
def health_check():
    key_loaded = bool(settings.gemini_api_key)
    return {"status": "ok", "gemini_key_loaded": key_loaded}


# ──────────────────────────────────────────
# AUTH
# ──────────────────────────────────────────

@app.post("/auth/login")
def login(body: LoginRequest):
    user = authenticate(body.email, body.password)
    if not user:
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")
    return {
        "token": user["id"],
        "user_id": user["id"],
        "name": user["name"],
    }

@app.post("/auth/cadastro")
def cadastro(body: CadastroRequest):
    if not body.name or not body.email or not body.password:
        raise HTTPException(status_code=400, detail="Preencha todos os campos.")
    criado = create_user(body.name, body.email, body.password)
    if not criado:
        raise HTTPException(status_code=409, detail="E-mail já cadastrado.")
    return {"message": "Conta criada com sucesso."}


# ──────────────────────────────────────────
# PLANO
# ──────────────────────────────────────────

@app.post("/plano/gerar")
def gerar_plano(body: PlanRequest):
    user = get_user_by_id(body.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    profile_data = body.model_dump()
    profile_data["name"] = user["name"]

    plano = generate_plan(profile_data)

    profile_data["plan_json"] = plano
    upsert_profile(body.user_id, profile_data)

    return {"plan": plano}

@app.get("/plano/{user_id}")
def buscar_plano(user_id: str):
    profile = get_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil não encontrado.")
    import json
    plan = json.loads(profile["plan_json"] or "{}")
    return {"plan": plan}


# ──────────────────────────────────────────
# CHAT
# ──────────────────────────────────────────

@app.post("/chat")
def chat(body: ChatRequest):
    resposta = responder_mensagem(body.mensagem)
    return {"resposta": resposta}