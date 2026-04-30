from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List


# User Schemas
class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="User's full name")
    email: str = Field(..., description="User's email address")
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")


class UserLogin(BaseModel):
    email: str = Field(..., description="User's email address")
    password: str = Field(..., min_length=1, description="User's password")


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    created_at: str

    class Config:
        from_attributes = True


# Profile Schemas
class ProfileCreate(BaseModel):
    age: int = Field(..., gt=0, le=120, description="Age must be between 1 and 120")
    biological_sex: str = Field(..., min_length=1, max_length=50, description="Biological sex")
    height_cm: float = Field(..., gt=0.0, le=300.0, description="Height in cm must be positive")
    weight_kg: float = Field(..., gt=0.0, le=500.0, description="Weight in kg must be positive")
    goal: str = Field(..., min_length=3, max_length=100, description="Main goal")
    other_goal: Optional[str] = Field(None, max_length=200, description="Other goal if applicable")
    dcnt: str = Field(..., min_length=1, max_length=10, description="DCNT presence")
    dcnt_details: Optional[str] = Field(None, max_length=500, description="DCNT details")
    activity_level: str = Field(..., min_length=1, max_length=50, description="Activity level")
    sleep_hours: float = Field(..., ge=0.0, le=24.0, description="Sleep hours")
    sleep_minutes: int = Field(..., ge=0, le=59, description="Sleep minutes")
    stress_level: int = Field(..., ge=1, le=5, description="Stress level from 1 to 5")
    motivations: Optional[str] = Field(None, max_length=1000, description="Motivations")
    objective: Optional[str] = Field(None, max_length=1000, description="Objectives")
    additional_details: Optional[str] = Field(None, max_length=1000, description="Additional details")
    meal_preferences: Optional[str] = Field(None, max_length=1000, description="Meal preferences")


class ProfileUpdate(BaseModel):
    age: Optional[int] = Field(None, gt=0, le=120)
    biological_sex: Optional[str] = Field(None, min_length=1, max_length=50)
    height_cm: Optional[float] = Field(None, gt=0.0, le=300.0)
    weight_kg: Optional[float] = Field(None, gt=0.0, le=500.0)
    goal: Optional[str] = Field(None, min_length=3, max_length=100)
    other_goal: Optional[str] = Field(None, max_length=200)
    dcnt: Optional[str] = Field(None, min_length=1, max_length=10)
    dcnt_details: Optional[str] = Field(None, max_length=500)
    activity_level: Optional[str] = Field(None, min_length=1, max_length=50)
    sleep_hours: Optional[float] = Field(None, ge=0.0, le=24.0)
    sleep_minutes: Optional[int] = Field(None, ge=0, le=59)
    stress_level: Optional[int] = Field(None, ge=1, le=5)
    motivations: Optional[str] = Field(None, max_length=1000)
    objective: Optional[str] = Field(None, max_length=1000)
    additional_details: Optional[str] = Field(None, max_length=1000)
    meal_preferences: Optional[str] = Field(None, max_length=1000)


class ProfileResponse(BaseModel):
    user_id: str
    age: Optional[int]
    biological_sex: Optional[str]
    height_cm: Optional[float]
    weight_kg: Optional[float]
    goal: Optional[str]
    other_goal: Optional[str]
    dcnt: Optional[str]
    dcnt_details: Optional[str]
    activity_level: Optional[str]
    sleep_hours: Optional[float]
    sleep_minutes: Optional[int]
    stress_level: Optional[int]
    motivations: Optional[str]
    objective: Optional[str]
    additional_details: Optional[str]
    meal_preferences: Optional[str]
    plan_json: Optional[str]
    streak_days: int
    last_checkin: Optional[str]
    updated_at: str

    class Config:
        from_attributes = True


# Post Schemas
class PostCreate(BaseModel):
    author_name: str = Field(..., min_length=1, max_length=100, description="Author's name")
    author_tag: Optional[str] = Field(None, max_length=50, description="Author's tag")
    content: str = Field(..., min_length=1, max_length=2000, description="Post content")


class PostResponse(BaseModel):
    id: str
    author_name: str
    author_tag: Optional[str]
    content: str
    likes: int
    comments_json: str
    created_at: str

    class Config:
        from_attributes = True


# Checkin Schemas
class CheckinCreate(BaseModel):
    day: str = Field(..., min_length=10, max_length=10, description="Date in YYYY-MM-DD format")
    mood: Optional[str] = Field(None, max_length=50, description="Mood")
    done: bool = Field(True, description="Whether the goal was achieved")
    notes: Optional[str] = Field(None, max_length=1000, description="Notes")


class CheckinResponse(BaseModel):
    id: str
    user_id: str
    day: str
    mood: Optional[str]
    done: int
    notes: Optional[str]
    created_at: str

    class Config:
        from_attributes = True


# Token Schemas (for authentication)
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None