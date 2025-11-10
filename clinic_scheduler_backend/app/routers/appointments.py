from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from ..database import get_db
from .. import models, schemas
from ..utils.jwt_token import verify_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return payload

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.post("/", response_model=schemas.Appointment)
def create_appointment(appt: schemas.AppointmentCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
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

@router.get("/", response_model=list[schemas.Appointment])
def get_appointments(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("sub")  # or "sub" if you encoded as sub
    role = current_user.get("role")

    if role == "admin":
        appointments = db.query(models.Appointment).all()
    elif role == "staff":
        appointments = db.query(models.Appointment).filter(models.Appointment.provider_id == user_id).all()
    else:  # patient
        appointments = db.query(models.Appointment).filter(models.Appointment.patient_id == user_id).all()

    return appointments


@router.put("/{appt_id}/status", response_model=schemas.Appointment)
def update_appointment_status(appt_id: str, status: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["staff", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to update appointment status")

    appointment = db.query(models.Appointment).filter(models.Appointment.appt_id == appt_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if status not in [e.value for e in models.StatusEnum]:
        raise HTTPException(status_code=400, detail="Invalid status")

    appointment.status = status
    db.commit()
    db.refresh(appointment)
    return appointment
