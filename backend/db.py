from __future__ import annotations

import hashlib
import json
import secrets
import sqlite3
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

DB_PATH = Path("nutriflow.db")


def now_iso() -> str:
    from datetime import datetime
    return datetime.now().isoformat(timespec="seconds")


def today_str() -> str:
    from datetime import date
    return date.today().isoformat()


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def hash_password(password: str, salt: Optional[str] = None) -> str:
    if salt is None:
        salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        200_000,
    ).hex()
    return f"{salt}${digest}"


def verify_password(password: str, stored: str) -> bool:
    try:
        salt, digest = stored.split("$", 1)
        return hash_password(password, salt) == stored
    except Exception:
        return False


def init_db() -> None:
    with get_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS profiles (
                user_id TEXT PRIMARY KEY,
                age INTEGER,
                biological_sex TEXT,
                height_cm REAL,
                weight_kg REAL,
                goal TEXT,
                other_goal TEXT,
                dcnt TEXT,
                dcnt_details TEXT,
                activity_level TEXT,
                sleep_hours REAL,
                sleep_minutes INTEGER,
                stress_level INTEGER,
                motivations TEXT,
                objective TEXT,
                additional_details TEXT,
                meal_preferences TEXT,
                plan_json TEXT,
                streak_days INTEGER DEFAULT 0,
                last_checkin TEXT,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS posts (
                id TEXT PRIMARY KEY,
                author_name TEXT NOT NULL,
                author_tag TEXT,
                content TEXT NOT NULL,
                likes INTEGER DEFAULT 0,
                comments_json TEXT DEFAULT '[]',
                created_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS checkins (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                day TEXT NOT NULL,
                mood TEXT,
                done INTEGER DEFAULT 1,
                notes TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
            """
        )
    seed_demo_data()


def user_count() -> int:
    with get_conn() as conn:
        row = conn.execute("SELECT COUNT(*) AS c FROM users").fetchone()
        return int(row["c"]) if row else 0


def post_count() -> int:
    with get_conn() as conn:
        row = conn.execute("SELECT COUNT(*) AS c FROM posts").fetchone()
        return int(row["c"]) if row else 0


def create_user(name: str, email: str, password: str) -> bool:
    email = email.strip().lower()
    if get_user_by_email(email):
        return False
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO users (id, email, password_hash, name, created_at) VALUES (?, ?, ?, ?, ?)",
            (str(uuid.uuid4()), email, hash_password(password), name.strip(), now_iso()),
        )
    return True


def get_user_by_email(email: str) -> Optional[sqlite3.Row]:
    with get_conn() as conn:
        return conn.execute("SELECT * FROM users WHERE email = ?", (email.strip().lower(),)).fetchone()


def get_user_by_id(user_id: str) -> Optional[sqlite3.Row]:
    with get_conn() as conn:
        return conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()


def authenticate(email: str, password: str) -> Optional[sqlite3.Row]:
    user = get_user_by_email(email)
    if user and verify_password(password, user["password_hash"]):
        return user
    return None


def get_profile(user_id: str) -> Optional[sqlite3.Row]:
    with get_conn() as conn:
        return conn.execute("SELECT * FROM profiles WHERE user_id = ?", (user_id,)).fetchone()


def upsert_profile(user_id: str, profile: Dict[str, Any]) -> None:
    payload = {
        "user_id": user_id,
        "age": profile.get("age"),
        "biological_sex": profile.get("biological_sex"),
        "height_cm": profile.get("height_cm"),
        "weight_kg": profile.get("weight_kg"),
        "goal": profile.get("goal"),
        "other_goal": profile.get("other_goal", ""),
        "dcnt": profile.get("dcnt"),
        "dcnt_details": profile.get("dcnt_details", ""),
        "activity_level": profile.get("activity_level"),
        "sleep_hours": profile.get("sleep_hours"),
        "sleep_minutes": profile.get("sleep_minutes"),
        "stress_level": profile.get("stress_level"),
        "motivations": profile.get("motivations", ""),
        "objective": profile.get("objective", ""),
        "additional_details": profile.get("additional_details", ""),
        "meal_preferences": profile.get("meal_preferences", ""),
        "plan_json": json.dumps(profile.get("plan_json", {}), ensure_ascii=False),
        "streak_days": int(profile.get("streak_days", 0)),
        "last_checkin": profile.get("last_checkin"),
        "updated_at": now_iso(),
    }
    with get_conn() as conn:
        exists = conn.execute("SELECT 1 FROM profiles WHERE user_id = ?", (user_id,)).fetchone()
        if exists:
            conn.execute(
                """
                UPDATE profiles SET
                    age=:age,
                    biological_sex=:biological_sex,
                    height_cm=:height_cm,
                    weight_kg=:weight_kg,
                    goal=:goal,
                    other_goal=:other_goal,
                    dcnt=:dcnt,
                    dcnt_details=:dcnt_details,
                    activity_level=:activity_level,
                    sleep_hours=:sleep_hours,
                    sleep_minutes=:sleep_minutes,
                    stress_level=:stress_level,
                    motivations=:motivations,
                    objective=:objective,
                    additional_details=:additional_details,
                    meal_preferences=:meal_preferences,
                    plan_json=:plan_json,
                    streak_days=:streak_days,
                    last_checkin=:last_checkin,
                    updated_at=:updated_at
                WHERE user_id=:user_id
                """,
                payload,
            )
        else:
            conn.execute(
                """
                INSERT INTO profiles (
                    user_id, age, biological_sex, height_cm, weight_kg, goal, other_goal,
                    dcnt, dcnt_details, activity_level, sleep_hours, sleep_minutes,
                    stress_level, motivations, objective, additional_details,
                    meal_preferences, plan_json, streak_days, last_checkin, updated_at
                ) VALUES (
                    :user_id, :age, :biological_sex, :height_cm, :weight_kg, :goal, :other_goal,
                    :dcnt, :dcnt_details, :activity_level, :sleep_hours, :sleep_minutes,
                    :stress_level, :motivations, :objective, :additional_details,
                    :meal_preferences, :plan_json, :streak_days, :last_checkin, :updated_at
                )
                """,
                payload,
            )


def all_posts() -> List[sqlite3.Row]:
    with get_conn() as conn:
        return conn.execute("SELECT * FROM posts ORDER BY created_at DESC").fetchall()


def create_post(author_name: str, author_tag: str, content: str) -> None:
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO posts (id, author_name, author_tag, content, likes, comments_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (str(uuid.uuid4()), author_name, author_tag, content, 0, json.dumps([], ensure_ascii=False), now_iso()),
        )


def like_post(post_id: str) -> None:
    with get_conn() as conn:
        conn.execute("UPDATE posts SET likes = likes + 1 WHERE id = ?", (post_id,))


def add_comment(post_id: str, comment: str) -> None:
    with get_conn() as conn:
        row = conn.execute("SELECT comments_json FROM posts WHERE id = ?", (post_id,)).fetchone()
        comments = json.loads(row["comments_json"] or "[]") if row else []
        comments.append({"text": comment, "created_at": now_iso()})
        conn.execute("UPDATE posts SET comments_json = ? WHERE id = ?", (json.dumps(comments, ensure_ascii=False), post_id))


def record_checkin(user_id: str, mood: str, notes: str, done: bool = True) -> None:
    day = today_str()
    with get_conn() as conn:
        profile = conn.execute("SELECT streak_days, last_checkin FROM profiles WHERE user_id = ?", (user_id,)).fetchone()
        current_streak = int(profile["streak_days"]) if profile and profile["streak_days"] is not None else 0
        last_checkin = profile["last_checkin"] if profile else None
        streak = current_streak if last_checkin == day else current_streak + (1 if done else 0)
        conn.execute(
            "INSERT INTO checkins (id, user_id, day, mood, done, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (str(uuid.uuid4()), user_id, day, mood, 1 if done else 0, notes, now_iso()),
        )
        conn.execute(
            "UPDATE profiles SET streak_days = ?, last_checkin = ?, updated_at = ? WHERE user_id = ?",
            (streak, day, now_iso(), user_id),
        )


def reset_streak(user_id: str) -> None:
    with get_conn() as conn:
        conn.execute(
            "UPDATE profiles SET streak_days = 0, last_checkin = NULL, updated_at = ? WHERE user_id = ?",
            (now_iso(), user_id),
        )


def seed_demo_data() -> None:
    if user_count() == 0:
        demo_users = [
            {
                "name": "Ana Souza",
                "email": "ana@demo.com",
                "password": "1234",
                "profile": {
                    "age": 29,
                    "biological_sex": "Feminino",
                    "height_cm": 164,
                    "weight_kg": 72,
                    "goal": "Emagrecimento",
                    "other_goal": "",
                    "dcnt": "Não",
                    "dcnt_details": "",
                    "activity_level": "Leve",
                    "sleep_hours": 7.5,
                    "sleep_minutes": 15,
                    "stress_level": 2,
                    "motivations": "Quero me sentir mais leve e confiante.",
                    "objective": "Ter mais energia para o trabalho.",
                    "additional_details": "Prefiro alimentos simples e rápidos.",
                    "meal_preferences": "Arroz, feijão, frango, frutas.",
                    "streak_days": 5,
                },
            },
            {
                "name": "Bruno Lima",
                "email": "bruno@demo.com",
                "password": "1234",
                "profile": {
                    "age": 34,
                    "biological_sex": "Masculino",
                    "height_cm": 178,
                    "weight_kg": 84,
                    "goal": "Ganho de massa muscular",
                    "other_goal": "",
                    "dcnt": "Não",
                    "dcnt_details": "",
                    "activity_level": "Moderado",
                    "sleep_hours": 6.5,
                    "sleep_minutes": 30,
                    "stress_level": 3,
                    "motivations": "Quero evoluir sem perder disciplina.",
                    "objective": "Ganhar força e consistência.",
                    "additional_details": "Tenho rotina de treino.",
                    "meal_preferences": "Mais proteína e praticidade.",
                    "streak_days": 2,
                },
            },
            {
                "name": "Carla Mendes",
                "email": "carla@demo.com",
                "password": "1234",
                "profile": {
                    "age": 41,
                    "biological_sex": "Feminino",
                    "height_cm": 160,
                    "weight_kg": 76,
                    "goal": "Controle de diabetes",
                    "other_goal": "",
                    "dcnt": "Diabetes",
                    "dcnt_details": "Diagnóstico há 4 anos",
                    "activity_level": "Leve",
                    "sleep_hours": 7.0,
                    "sleep_minutes": 0,
                    "stress_level": 4,
                    "motivations": "Quero ter mais segurança com a alimentação.",
                    "objective": "Manter a glicemia controlada.",
                    "additional_details": "Preciso de refeições previsíveis.",
                    "meal_preferences": "Baixo índice glicêmico.",
                    "streak_days": 8,
                },
            },
        ]
        for demo in demo_users:
            create_user(demo["name"], demo["email"], demo["password"])
            user = get_user_by_email(demo["email"])
            if user:
                profile = dict(demo["profile"])
                profile["plan_json"] = {}
                upsert_profile(user["id"], profile)

    if post_count() == 0:
        demo_posts = [
            ("Marina", "@marinafit", "Hoje consegui seguir meu plano por 5 dias seguidos. Pequenos passos fazem diferença!"),
            ("Rafael", "@rafanutri", "Troquei o lanche da tarde por frutas e iogurte. Energia subiu muito."),
            ("Lívia", "@liviama", "Dá vontade de desistir às vezes, mas ver meu motivo escrito na tela ajuda."),
        ]
        for author_name, author_tag, content in demo_posts:
            create_post(author_name, author_tag, content)
