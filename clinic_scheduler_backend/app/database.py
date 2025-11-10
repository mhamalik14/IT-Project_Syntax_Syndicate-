from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./clinic.db")

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}  # required for SQLite
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Import models so tables are registered
from app.models import user  # make sure this path is correct

# Create all tables
Base.metadata.create_all(bind=engine)
