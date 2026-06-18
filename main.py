from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import Request
from sqlalchemy.orm import Session
from sqlalchemy import desc
import json
import re
from datetime import datetime

# 🔥 CORREÇÃO: Importei PostLike junto aos outros modelos
from backend.models import Base, User, Profile, Post, PostLike
from backend.schemas import (
    UserCreate, UserLogin, TokenResponse,
    ProfileCreate, PlanResponse,
    ChatRequest, ChatResponse,
)
from backend.database import engine, get_db, hash_password, verify_password
from backend.ai import generate_plan
from backend.chat import responder_mensagem
# from backend.db import hash_password, verify_password

import uuid

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NutriFlow API", version="1.0.0")

# ──────────────────────────────────────────
# CORS DINÂMICO PARA RANGE DE PORTAS (517x)
# ──────────────────────────────────────────
@app.middleware("http")
async def cors_dinamico_viteland(request: Request, call_next):
    origin = request.headers.get("Origin", "")
    
    if request.method == "OPTIONS":
        response = JSONResponse(content={"message": "CORS OK"})
    else:
        response = await call_next(request)
        
    if origin and re.match(r"^https?://(localhost|127\.0\.0\.1):517\d$", origin):
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
        
    return response

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

    return {"token": user.id, "user_id": user.id, "name": user.name}

# ──────────────────────────────────────────
# ROTAS DO PERFIL
# ──────────────────────────────────────────
@app.get("/api/v1/profile/{user_id}")
def obtener_perfil(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
        
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    
    if not profile:
        return {
            "nome": user.name,
            "idade": 25,
            "peso": 70,
            "altura": 170,
            "sexo": "Masculino",
            "nivelAtividade": "Moderado"
        }
        
    return {
        "nome": user.name,
        "idade": getattr(profile, "age", 25),
        "peso": getattr(profile, "weight_kg", 70),
        "altura": getattr(profile, "height_cm", 170),
        "sexo": getattr(profile, "biological_sex", "Masculino"),
        "nivelAtividade": getattr(profile, "activity_level", "Moderado")
    }

@app.post("/api/v1/profile/{user_id}")
def salvar_perfil(user_id: str, dados: dict, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    
    if not profile:
        profile = Profile(user_id=user_id)
        db.add(profile)
        
    profile.age = dados.get("idade")
    profile.weight_kg = dados.get("peso")
    profile.height_cm = dados.get("altura")
    profile.biological_sex = dados.get("sexo")
    profile.activity_level = dados.get("nivelAtividade")
    
    # Grava a data e hora exata da atualização no banco de dados!
    profile.updated_at = datetime.utcnow().isoformat()
        
    db.commit()
    return {"status": "success", "message": "Perfil updated com sucesso."}

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
        resposta = responder_mensagem(body.mensagem) 
        return {"resposta": resposta}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ──────────────────────────────────────────
# DASHBOARD
# ──────────────────────────────────────────
@app.get("/dashboard/{user_id}")
def obtener_dados_dashboard(user_id: str, db: Session = Depends(get_db)):
    if not user_id or user_id == "null":
        return {
            "frase": "Faça login no NutriAI para acompanhar suas metas!",
            "dias_consecutivos": 0,
            "meta_kcal": 2000,
            "meta_treino": "Nenhum treino listado.",
        }

    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        return {
            "frase": "Complete seu perfil para calcularmos suas metas!",
            "dias_consecutivos": 0,
            "meta_kcal": 2000,
            "meta_treino": "Preencha seus dados físicos no Perfil.",
        }

    plan = {}
    if profile.plan_json and profile.plan_json != "{}":
        try:
            plan = json.loads(profile.plan_json)
        except:
            plan = {}

    if plan:
        frase = plan.get("motivational_phrase", "Continue firme no seu objetivo!")
        meta_kcal = plan.get("daily_goal", "Consulte seu plano.")
        meta_treino = plan.get("next_actions", ["Defina sua rotina de treinos."])[0]
    else:
        peso = getattr(profile, "weight_kg", 64) or 64
        altura = getattr(profile, "height_cm", 160) or 160
        idade = getattr(profile, "age", 33) or 33
        sexo = getattr(profile, "biological_sex", "Feminino")
        
        if sexo == "Feminino":
            tmb = 447.6 + (9.2 * peso) + (3.1 * altura) - (4.3 * idade)
        else:
            tmb = 88.36 + (13.4 * peso) + (4.8 * altura) - (5.7 * idade)
            
        objetivo = getattr(profile, "goal", "Emagrecimento") or "Emagrecimento"
        meta_kcal = int(tmb * 1.35) - 400 if "Emagrecer" in objetivo or "Emagrecimento" in objetivo else int(tmb * 1.35)
        
        frase = getattr(profile, "motivations", "Quero me sentir mais leve e confiante.")
        meta_treino = f"Focar no plano de {objetivo}"

    return {
        "frase": frase,
        "dias_consecutivos": getattr(profile, "streak_days", 0) or 0,
        "meta_kcal": meta_kcal,
        "meta_treino": meta_treino,
    }

@app.post("/dashboard/{user_id}/checkin")
def realizar_checkin(user_id: str, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil não encontrado.")

    hoje_str = datetime.utcnow().date().isoformat()
    
    if profile.last_checkin != hoje_str:
        profile.streak_days = (profile.streak_days or 0) + 1
        profile.last_checkin = hoje_str
        db.commit()
        return {"status": "sucesso", "dias_consecutivos": profile.streak_days, "mensagem": "Check-in feito!"}
        
    return {"status": "aviso", "dias_consecutivos": profile.streak_days, "mensagem": "Você já fez check-in hoje!"}

@app.post("/dashboard/{user_id}/reiniciar")
def reiniciar_contagem_dashboard(user_id: str, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil não encontrado.")

    profile.streak_days = 0
    profile.last_checkin = None
    db.commit()
    return {"status": "sucesso", "mensagem": "Contagem reiniciada com sucesso."}


# ──────────────────────────────────────────
# ROTAS DA COMUNIDADE (ATUALIZADAS)
# ──────────────────────────────────────────
@app.get("/api/v1/posts")
def listar_posts(filtro: str = "Para você", user_id: str = None, db: Session = Depends(get_db)):
    query = db.query(Post)
    
    # 1. Lógica para "Meus posts": Apenas os meus
    if filtro == "Meus posts" and user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            query = query.filter(Post.author_name == user.name)
            
    # 2. Lógica para "Seguindo": Todo mundo, MENOS os meus
    elif filtro == "Seguindo" and user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            query = query.filter(Post.author_name != user.name)
            
    # 3. Lógica para "Para você": Todos (o padrão da query)
    
    posts = query.order_by(desc(Post.created_at)).all()
    
    resultado = []
    for post in posts:
        try:
            comentarios = json.loads(post.comments_json) if post.comments_json else []
        except:
            comentarios = []

        resultado.append({
            "id": post.id,
            "autor_name": post.author_name,
            "autor_tag": post.author_tag,
            "conteudo": post.content,
            "likes": post.likes or 0,
            "comentarios": comentarios,
            "data": post.created_at
        })
        
    return resultado


@app.post("/api/v1/posts", status_code=status.HTTP_201_CREATED)
def criar_post(dados: dict, db: Session = Depends(get_db)):
    user_id = dados.get("user_id")
    conteudo = dados.get("conteudo")
    
    if not user_id or not conteudo:
        raise HTTPException(status_code=400, detail="Dados incompletos para postagem.")
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    novo_post = Post(
        id=str(uuid.uuid4()),                       
        author_name=user.name,                      
        author_tag=f"@{user.name.lower().replace(' ', '')}", 
        content=conteudo,                           
        likes=0,                                    
        comments_json="[]",                         
        created_at=datetime.utcnow().isoformat()    
    )
    
    db.add(novo_post)
    db.commit()
    db.refresh(novo_post)
    
    return {"status": "success", "message": "Post publicado com sucesso!", "post_id": novo_post.id}


# ──────────────────────────────────────────
# INTERAÇÕES DA COMUNIDADE (CURTIDAS E COMENTÁRIOS)
# ──────────────────────────────────────────

@app.post("/api/v1/posts/{post_id}/like")
def curtir_post(post_id: str, dados: dict, db: Session = Depends(get_db)):
    user_id = dados.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID é obrigatório.")
        
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado.")
    
    # Verifica se o usuário já curtiu este post na tabela PostLike
    like_existente = db.query(PostLike).filter(
        PostLike.post_id == post_id, 
        PostLike.user_id == user_id
    ).first()

    if like_existente:
        # Se já curtiu, remove o like (Descurtir)
        db.delete(like_existente)
        post.likes = max(0, (post.likes or 0) - 1)
    else:
        # Se não curtiu, adiciona o registro na tabela PostLike (Curtir)
        novo_like = PostLike(post_id=post_id, user_id=user_id)
        db.add(novo_like)
        post.likes = (post.likes or 0) + 1
    
    db.commit()
    db.refresh(post)
    
    return {"status": "success", "likes": post.likes}


@app.post("/api/v1/posts/{post_id}/comment")
def adicionar_comentario(post_id: str, dados: dict, db: Session = Depends(get_db)):
    user_id = dados.get("user_id")
    texto_comentario = dados.get("comentario")
    
    if not user_id or not texto_comentario:
        raise HTTPException(status_code=400, detail="Dados incompletos para comentar.")
        
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado.")
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    try:
        lista_comentarios = json.loads(post.comments_json) if post.comments_json else []
    except:
        lista_comentarios = []
        
    novo_comentario = {
        "id": str(uuid.uuid4()),
        "autor_name": user.name,
        "conteudo": texto_comentario,
        "created_at": datetime.utcnow().isoformat()
    }
    lista_comentarios.append(novo_comentario)
    
    post.comments_json = json.dumps(lista_comentarios, ensure_ascii=False)
    db.commit()
    
    return {"status": "success", "comentarios": lista_comentarios}