from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from .database import Base
import datetime
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(String, default=lambda: datetime.datetime.now().isoformat())
    profile = relationship("Profile", back_populates="user", uselist=False)

class Profile(Base):
    __tablename__ = "profiles"
    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    age = Column(Integer)
    biological_sex = Column(String)
    height_cm = Column(Float)
    weight_kg = Column(Float)
    goal = Column(String)
    other_goal = Column(String)
    dcnt = Column(String)
    dcnt_details = Column(String)
    activity_level = Column(String)
    sleep_hours = Column(Float)
    sleep_minutes = Column(Integer)
    stress_level = Column(Integer)
    motivations = Column(Text)
    objective = Column(Text)
    additional_details = Column(Text)
    meal_preferences = Column(Text)
    plan_json = Column(Text)
    streak_days = Column(Integer, default=0)
    last_checkin = Column(String)
    updated_at = Column(String, default=lambda: datetime.datetime.now().isoformat())
    
    user = relationship("User", back_populates="profile")

class Post(Base):
    __tablename__ = "posts"
    id = Column(String, primary_key=True, default=generate_uuid)
    author_name = Column(String, nullable=False)
    author_tag = Column(String)
    content = Column(Text, nullable=False)
    likes = Column(Integer, default=0)
    comments_json = Column(Text, default="[]")
    created_at = Column(String, default=lambda: datetime.datetime.now().isoformat())

class Checkin(Base):
    __tablename__ = "checkins"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    day = Column(String, nullable=False)
    mood = Column(String)
    done = Column(Boolean, default=True)
    notes = Column(Text)
    created_at = Column(String, default=lambda: datetime.datetime.now().isoformat())
