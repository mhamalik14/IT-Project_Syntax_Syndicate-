from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.post("/", response_model=schemas.Appointment)
def create_appointment(appt: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    # Validate end_time is after start_time
    if appt.end_time <= appt.start_time:
        raise HTTPException(status_code=400, detail="End time must be after start time")
    
    # Check for overlapping appointments in the same room
    conflict = db.query(models.Appointment).filter(
        and_(
            models.Appointment.clinic_id == appt.clinic_id,
            models.Appointment.room_id == appt.room_id,
            models.Appointment.status != models.StatusEnum.cancelled,
            or_(
                # New appointment starts during existing appointment
                and_(
                    models.Appointment.start_time <= appt.start_time,
                    models.Appointment.end_time > appt.start_time
                ),
                # New appointment ends during existing appointment
                and_(
                    models.Appointment.start_time < appt.end_time,
                    models.Appointment.end_time >= appt.end_time
                ),
                # New appointment completely contains existing appointment
                and_(
                    models.Appointment.start_time >= appt.start_time,
                    models.Appointment.end_time <= appt.end_time
                )
            )
        )
    ).first()

    if conflict:
        raise HTTPException(status_code=409, detail="Time slot conflicts with existing appointment")

    try:
        new_appt = models.Appointment(**appt.dict())
        db.add(new_appt)
        db.commit()
        db.refresh(new_appt)
        return new_appt
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")