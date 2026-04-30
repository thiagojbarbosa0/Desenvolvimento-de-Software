from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    token: str
    user_id: str
    name: str

class ProfileCreate(BaseModel):
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

class PlanResponse(BaseModel):
    status: str
    data: Any

class ChatRequest(BaseModel):
    mensagem: str
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    resposta: str
