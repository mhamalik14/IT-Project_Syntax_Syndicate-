from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/clinics", tags=["Clinics"])

@router.post("/", response_model=schemas.Clinic)
def create_clinic(clinic: schemas.ClinicCreate, db: Session = Depends(get_db)):
    new_clinic = models.Clinic(**clinic.dict())
    db.add(new_clinic)
    db.commit()
    db.refresh(new_clinic)
    return new_clinic

@router.get("/", response_model=list[schemas.Clinic])
def get_clinics(db: Session = Depends(get_db)):
    clinics = db.query(models.Clinic).all()
    return clinics

@router.get("/{clinic_id}", response_model=schemas.Clinic)
def get_clinic(clinic_id: str, db: Session = Depends(get_db)):
    clinic = db.query(models.Clinic).filter(models.Clinic.id == clinic_id).first()
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    return clinic
