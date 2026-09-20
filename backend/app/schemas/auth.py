from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class RegisterRequest(BaseModel):
    full_name: Optional[str] = None
    email: str
    username: str
    password: str
    confirm_password: str


class RegisterResponse(BaseModel):
    message: str


class CreateUserRequest(BaseModel):
    full_name: Optional[str] = None
    email: str
    username: str
    password: str
    role: str = "officer"


class UserStatusUpdate(BaseModel):
    is_active: bool



class LoginRequest(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

