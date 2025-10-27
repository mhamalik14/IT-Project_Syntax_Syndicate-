from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String(20), default="patient")  # patient, staff, admin

created_at = Column(DateTime(timezone=True), server_default=func.now())
updated_at = Column(DateTime(timezone=True), onupdate=func.now())

appointments = relationship("Appointment", back_populates="patient")
