from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, database
from .services import ai_service
import hashlib

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="NutriFlow API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

@app.get("/")
def health():
    return {"status": "online"}

@app.post("/auth/cadastro", status_code=status.HTTP_201_CREATED)
def cadastro(user_in: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=409, detail="E-mail já cadastrado.")
    
    new_user = models.User(
        name=user_in.name,
        email=user_in.email,
        password_hash=hash_password(user_in.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Conta criada com sucesso."}

@app.post("/auth/login", response_model=schemas.TokenResponse)
def login(login_in: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == login_in.email).first()
    if not user or user.password_hash != hash_password(login_in.password):
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")
    
    return {
        "token": user.id,
        "user_id": user.id,
        "name": user.name
    }

@app.post("/api/v1/plan", response_model=schemas.PlanResponse)
def create_plan(profile: schemas.ProfileCreate, db: Session = Depends(database.get_db)):
    plan_result = ai_service.generate_nutritional_plan(profile)
    
    # Save to profile
    db_profile = db.query(models.Profile).filter(models.Profile.user_id == profile.user_id).first()
    
    import json
    if db_profile:
        for key, value in profile.dict().items():
            setattr(db_profile, key, value)
        db_profile.plan_json = json.dumps(plan_result)
    else:
        db_profile = models.Profile(**profile.dict(), plan_json=json.dumps(plan_result))
        db.add(db_profile)
    
    db.commit()
    return {"status": "success", "data": plan_result}

# ──────────────────────────────────────────
# CHAT
# ──────────────────────────────────────────

@app.post("/chat", response_model=schemas.ChatResponse)
def chat(body: schemas.ChatRequest):
    resposta = ai_service.responder_mensagem_chat(body.mensagem)
    return {"resposta": resposta}

# ──────────────────────────────────────────
# DASHBOARD
# ──────────────────────────────────────────

@app.get("/dashboard/{user_id}")
def obter_dados_dashboard(user_id: str):
    if user_id == "null" or not user_id:
        return {
            "frase": "Faça login no NutriFlow para acompanhar suas metas!",
            "dias_consecutivos": 0,
            "meta_kcal": 2000,
            "meta_treino": "Nenhum treino listado."
        }
    return {
        "frase": "Não diminua a meta, aumente o esforço!",
        "dias_consecutivos": 1,
        "meta_kcal": 2350,
        "meta_treino": "levantamento de garfo, 20 minutes"
    }

@app.post("/dashboard/{user_id}/reiniciar")
def reiniciar_contagem_dashboard(user_id: str):
    return {"status": "sucesso", "mensagem": "Contagem reiniciada com sucesso"}