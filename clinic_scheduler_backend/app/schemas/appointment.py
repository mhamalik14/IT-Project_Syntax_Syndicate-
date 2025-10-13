from pydantic import BaseModel, ConfigDict
from datetime import datetime
import uuid

class AppointmentBase(BaseModel):
    clinic_id: uuid.UUID
    room_id: uuid.UUID
    patient_id: uuid.UUID
    provider_id: uuid.UUID
    start_time: datetime
    end_time: datetime

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    appt_id: uuid.UUID
    status: str

    model_config = ConfigDict(from_attributes=True)