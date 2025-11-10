from pydantic import BaseModel, ConfigDict
import uuid

class ProviderBase(BaseModel):
    clinic_id: uuid.UUID
    name: str
    specialty: str | None = None
    email: str
    phone: str | None = None

class ProviderCreate(ProviderBase):
    pass

class Provider(ProviderBase):
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)
