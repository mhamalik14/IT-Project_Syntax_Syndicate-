from sqlalchemy import Column, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
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
