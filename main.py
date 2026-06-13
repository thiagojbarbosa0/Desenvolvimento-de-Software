from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json

from backend.models import Base, User, Profile
from backend.schemas import (
    UserCreate, UserLogin, TokenResponse,
    ProfileCreate, PlanResponse,
    ChatRequest, ChatResponse,
)
from backend.database import engine, get_db
from backend.ai import generate_plan, generate_chat_response
from backend.db import hash_password, verify_password

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NutriFlow API", version="1.0.0")

# ──────────────────────────────────────────
# CORS
# ──────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # restrinja em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────
# HEALTHCHECK
# ──────────────────────────────────────────
@app.get("/")
def health():
    return {"status": "online"}

# ──────────────────────────────────────────
# AUTH
# ──────────────────────────────────────────
@app.post("/auth/cadastro", status_code=status.HTTP_201_CREATED)
def cadastro(user_in: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(status_code=409, detail="E-mail já cadastrado.")

    new_user = User(
        name=user_in.name,
        email=user_in.email.strip().lower(),
        password_hash=hash_password(user_in.password),
    )
    db.add(new_user)
    db.commit()
    return {"message": "Conta criada com sucesso."}


@app.post("/auth/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email.strip().lower()).first()
    if not user or not verify_password(login_in.password, user.password_hash):
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")

    # NOTA: token = user_id por simplicidade (sem JWT). Dívida técnica conhecida.
    return {"token": user.id, "user_id": user.id, "name": user.name}

# ──────────────────────────────────────────
# PLANO NUTRICIONAL
# ──────────────────────────────────────────
@app.post("/api/v1/plan", response_model=PlanResponse)
def create_plan(profile: ProfileCreate, db: Session = Depends(get_db)):
    plan_result = generate_plan(profile.dict())

    db_profile = db.query(Profile).filter(Profile.user_id == profile.user_id).first()
    plan_json_str = json.dumps(plan_result, ensure_ascii=False)

    if db_profile:
        for key, value in profile.dict().items():
            setattr(db_profile, key, value)
        db_profile.plan_json = plan_json_str
    else:
        db_profile = Profile(**profile.dict(), plan_json=plan_json_str)
        db.add(db_profile)

    db.commit()
    return {"status": "success", "data": plan_result}

# ──────────────────────────────────────────
# CHAT
# ──────────────────────────────────────────
@app.post("/chat", response_model=ChatResponse)
def chat(body: ChatRequest):
    try:
        resposta = generate_chat_response(body.mensagem)
        return {"resposta": resposta}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ──────────────────────────────────────────
# DASHBOARD
# ──────────────────────────────────────────
@app.get("/dashboard/{user_id}")
def obter_dados_dashboard(user_id: str, db: Session = Depends(get_db)):
    if not user_id or user_id == "null":
        return {
            "frase": "Faça login no NutriAI para acompanhar suas metas!",
            "dias_consecutivos": 0,
            "meta_kcal": 2000,
            "meta_treino": "Nenhum treino listado.",
        }

    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil não encontrado.")

    plan = json.loads(profile.plan_json) if profile.plan_json else {}
    return {
        "frase": plan.get("motivational_phrase", "Continue firme no seu objetivo!"),
        "dias_consecutivos": profile.streak_days or 0,
        "meta_kcal": plan.get("daily_goal", "Consulte seu plano."),
        "meta_treino": plan.get("next_actions", ["Defina sua rotina de treinos."])[0],
    }


@app.post("/dashboard/{user_id}/reiniciar")
def reiniciar_contagem_dashboard(user_id: str, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil não encontrado.")

    profile.streak_days = 0
    profile.last_checkin = None
    db.commit()
    return {"status": "sucesso", "mensagem": "Contagem reiniciada com sucesso."}
