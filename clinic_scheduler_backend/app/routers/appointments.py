from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from uuid import UUID  # ✅ FIX
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


# ---------------- CREATE ----------------
@router.post("/", response_model=schemas.Appointment)
def create_appointment(
    appt: schemas.AppointmentCreate, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):

    # Validate end_time is after start_time
    if appt.end_time <= appt.start_time:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    # Convert IDs to UUID (🔥 FIX)
    try:
        appt_dict = appt.dict()
        appt_dict["clinic_id"] = UUID(appt_dict["clinic_id"])
        appt_dict["room_id"] = UUID(appt_dict["room_id"])
        appt_dict["patient_id"] = UUID(appt_dict["patient_id"])
        appt_dict["provider_id"] = UUID(appt_dict["provider_id"]) if appt_dict.get("provider_id") else None
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    # Check for overlapping appointments
    conflict = db.query(models.Appointment).filter(
        and_(
            models.Appointment.clinic_id == appt_dict["clinic_id"],
            models.Appointment.room_id == appt_dict["room_id"],
            models.Appointment.status != models.StatusEnum.cancelled,
            or_(
                # New appointment starts during existing appointment
                and_(models.Appointment.start_time <= appt.start_time,
                     models.Appointment.end_time > appt.start_time),
                # New appointment ends during existing appointment
                and_(models.Appointment.start_time < appt.end_time,
                     models.Appointment.end_time >= appt.end_time),
                # New appointment fully contains existing
                and_(models.Appointment.start_time >= appt.start_time,
                     models.Appointment.end_time <= appt.end_time)
            )
        )
    ).first()

    if conflict:
        raise HTTPException(status_code=409, detail="Time slot conflicts with existing appointment")

    try:
        new_appt = models.Appointment(**appt_dict)
        db.add(new_appt)
        db.commit()
        db.refresh(new_appt)
        return new_appt

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ---------------- GET ----------------
@router.get("/", response_model=list[schemas.Appointment])
def get_appointments(
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):

    raw_user_id = current_user.get("user_id")
    role = current_user.get("role")

    # 🔥 FIX user_id conversion
    try:
        user_id = UUID(raw_user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid user UUID")

    if role == "admin":
        appointments = db.query(models.Appointment).all()

    elif role == "staff":
        appointments = db.query(models.Appointment).filter(
            models.Appointment.provider_id == user_id
        ).all()

    else:  # patient
        appointments = db.query(models.Appointment).filter(
            models.Appointment.patient_id == user_id
        ).all()

    return appointments


# ---------------- UPDATE STATUS ----------------
@router.put("/{appt_id}/status", response_model=schemas.Appointment)
def update_appointment_status(
    appt_id: str, 
    status: str, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):

    if current_user.get("role") not in ["staff", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to update appointment status")

    # UUID conversion (🔥 FIX)
    try:
        appt_uuid = UUID(appt_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid appointment UUID")

    appointment = db.query(models.Appointment).filter(
        models.Appointment.appt_id == appt_uuid
    ).first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if status not in [e.value for e in models.StatusEnum]:
        raise HTTPException(status_code=400, detail="Invalid status")

    appointment.status = status
    db.commit()
    db.refresh(appointment)
    return appointment


# ---------------- DELETE ----------------
@router.delete("/{appt_id}")
def delete_appointment(
    appt_id: str, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):

    role = current_user.get("role")

    # UUID conversion (🔥 FIX)
    try:
        appt_uuid = UUID(appt_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid appointment UUID")

    raw_user_id = current_user.get("user_id")

    try:
        user_id = UUID(raw_user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid user UUID")

    if role not in ["staff", "admin"]:
        appointment = db.query(models.Appointment).filter(
            models.Appointment.appt_id == appt_uuid,
            models.Appointment.patient_id == user_id
        ).first()

        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found or not authorized")

    else:
        appointment = db.query(models.Appointment).filter(
            models.Appointment.appt_id == appt_uuid
        ).first()

        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")

    db.delete(appointment)
    db.commit()

    return {"message": "Appointment deleted successfully"}
