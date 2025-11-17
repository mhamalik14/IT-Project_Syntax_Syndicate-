from pydantic import BaseModel, EmailStr, field_validator
from datetime import date
import uuid
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "patient"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    role: str

    model_config = {
        "from_attributes": True
    }

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None   # <-- IMPORTANT
    address: Optional[str] = None
    emergency_contact: Optional[str] = None

    @field_validator("date_of_birth", mode="before")
    def empty_string_to_none(cls, v):
        if v == "" or v is None:
            return None
        return v

class UserProfile(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    role: str
    phone: str | None = None
    date_of_birth: date | None = None
    address: str | None = None
    emergency_contact: str | None = None

    model_config = {
        "from_attributes": True
    }
