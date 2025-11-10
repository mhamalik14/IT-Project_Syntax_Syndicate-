from pydantic import BaseModel, ConfigDict
import uuid

class RoomBase(BaseModel):
    clinic_id: uuid.UUID
    name: str
    room_type: str | None = None

class RoomCreate(RoomBase):
    pass

class Room(RoomBase):
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)
