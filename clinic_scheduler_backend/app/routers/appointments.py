from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.post("/", response_model=schemas.Appointment)
def create_appointment(appt: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    # Check for conflicts
    conflict = db.query(models.Appointment).filter(
        models.Appointment.clinic_id == appt.clinic_id,
        models.Appointment.room_id == appt.room_id,
        models.Appointment.start_time == appt.start_time
    ).first()

    if conflict:
        raise HTTPException(status_code=409, detail="Slot already booked")

    new_appt = models.Appointment(**appt.dict())
    db.add(new_appt)
    db.commit()
    db.refresh(new_appt)
    return new_appt
