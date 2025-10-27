from sqlalchemy import Column, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
import uuid
import enum
from app.database import Base

class StatusEnum(str, enum.Enum):
    booked = "booked"
    confirmed = "confirmed"
    cancelled = "cancelled"
    completed = "completed"
    no_show = "no_show"

class Appointment(Base):
    __tablename__ = "appointments"

    appt_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID(as_uuid=True), nullable=False)
    room_id = Column(UUID(as_uuid=True), nullable=False)
    patient_id = Column(UUID(as_uuid=True), nullable=False)
    provider_id = Column(UUID(as_uuid=True), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status = Column(Enum(StatusEnum), default=StatusEnum.booked)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    patient_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    patient = relationship("User", back_populates="appointments")
    status = Column(Enum(StatusEnum), nullable=False, server_default="booked")

