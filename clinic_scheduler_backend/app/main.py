from fastapi import FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import os
import hashlib
import hmac
import jwt
from datetime import datetime, timedelta

# ==========================================================
# CONFIG
# ==========================================================
SECRET_KEY = "your_secret_key"  # ⚠️ Replace with a secure secret in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 1

# ==========================================================
# SCHEMAS
# ==========================================================
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "patient"


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True  # for Pydantic v2

# ==========================================================
# PASSWORD UTILITIES
# ==========================================================
def hash_password(password: str) -> str:
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100_000)
    return f"{salt.hex()}:{dk.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        salt_hex, dk_hex = stored.split(":")
        salt = bytes.fromhex(salt_hex)
        dk = bytes.fromhex(dk_hex)
        new_dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100_000)
        return hmac.compare_digest(new_dk, dk)
    except Exception:
        return False

# ==========================================================
# FASTAPI APP SETUP
# ==========================================================
app = FastAPI(title="Clinic Scheduler API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# FAKE IN-MEMORY DATABASE
# ==========================================================
fake_db = {}  # Note: This is in-memory, profile updates won't persist across restarts

# ==========================================================
# AUTH ROUTES
# ==========================================================
@app.get("/")
def read_root():
    return {"message": "API is running!"}


@app.post("/auth/register", response_model=UserOut)
def register(user: UserCreate):
    if user.email in fake_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    hashed_pw = hash_password(user.password)
    user_id = uuid.uuid4()
    user_data = {
        "id": user_id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "password": hashed_pw,
    }
    fake_db[user.email] = user_data
    return user_data


@app.post("/auth/login")
def login(user: UserLogin):
    db_user = fake_db.get(user.email)
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials",
        )

    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    payload = {
        "sub": str(db_user["id"]),
        "email": db_user["email"],
        "name": db_user["name"],
        "role": db_user["role"],
        "exp": expire,
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

@app.get("/auth/profile")
def get_profile(request: Request):
    # Get token from Authorization header
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token missing or invalid")

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("email")
        if not user_email or user_email not in fake_db:
            raise HTTPException(status_code=401, detail="Invalid token")

        user_data = fake_db[user_email]
        return {
            "id": user_data["id"],
            "name": user_data.get("name", ""),
            "email": user_data["email"],
            "role": user_data["role"],
            "phone": user_data.get("phone", None),
            "date_of_birth": user_data.get("date_of_birth", None),
            "address": user_data.get("address", None),
            "emergency_contact": user_data.get("emergency_contact", None),
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.put("/auth/profile")
def update_profile(user_update: dict, request: Request):
    # Get token from Authorization header
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token missing or invalid")

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("email")
        if not user_email or user_email not in fake_db:
            raise HTTPException(status_code=401, detail="Invalid token")

        user_data = fake_db[user_email]
        # Update fields
        for field in ["name", "phone", "date_of_birth", "address", "emergency_contact"]:
            if field in user_update and user_update[field] is not None:
                user_data[field] = user_update[field]

        return {
            "id": user_data["id"],
            "name": user_data.get("name", ""),
            "email": user_data["email"],
            "role": user_data["role"],
            "phone": user_data.get("phone", None),
            "date_of_birth": user_data.get("date_of_birth", None),
            "address": user_data.get("address", None),
            "emergency_contact": user_data.get("emergency_contact", None),
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==========================================================
# INCLUDE ROUTERS
# ==========================================================
from .routers import appointments, auth  # Make sure this path matches your project structure
app.include_router(appointments.router)
app.include_router(auth.router)
