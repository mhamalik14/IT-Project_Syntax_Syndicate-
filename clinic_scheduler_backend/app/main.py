from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import uuid
import os
import hashlib
import hmac
from app.schemas.user import UserCreate, UserOut, UserLogin

# --- Password hashing utils ---
def hash_password(password: str) -> str:
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100000)
    return salt.hex() + ":" + dk.hex()

def verify_password(password: str, stored: str) -> bool:
    try:
        salt_hex, dk_hex = stored.split(":")
    except ValueError:
        return False
    salt = bytes.fromhex(salt_hex)
    dk = bytes.fromhex(dk_hex)
    new_dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100000)
    return hmac.compare_digest(new_dk, dk)

# --- FastAPI app ---
app = FastAPI()

# --- CORS middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-memory "database" ---
fake_db = {}

# --- Routes ---
@app.get("/")
def read_root():
    return {"message": "API is running!"}

@app.post("/auth/register", response_model=UserOut)
def register(user: UserCreate):
    if user.email in fake_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    hashed_pw = hash_password(user.password)
    user_id = uuid.uuid4()
    user_data = {
        "id": user_id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "password": hashed_pw
    }
    fake_db[user.email] = user_data
    return user_data

@app.post("/auth/login")
def login(user: UserLogin):
    db_user = fake_db.get(user.email)
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials"
        )
    # For frontend compatibility
    return {
        "success": True,
        "user": {
            "id": str(db_user["id"]),
            "name": db_user["name"],
            "email": db_user["email"],
            "role": db_user["role"]
        },
        "message": f"Welcome {db_user['name']}"
    }

