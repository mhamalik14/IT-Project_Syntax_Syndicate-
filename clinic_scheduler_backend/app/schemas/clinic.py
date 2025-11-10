from pydantic import BaseModel, ConfigDict
import uuid

class ClinicBase(BaseModel):
    name: str
    address: str
    phone: str | None = None

class ClinicCreate(ClinicBase):
    pass

class Clinic(ClinicBase):
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)
