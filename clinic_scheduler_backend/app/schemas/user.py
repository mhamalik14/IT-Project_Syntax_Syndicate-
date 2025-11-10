from pydantic import BaseModel, EmailStr
from datetime import date
import uuid

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
    name: str | None = None
    phone: str | None = None
    date_of_birth: date | None = None
    address: str | None = None
    emergency_contact: str | None = None

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
