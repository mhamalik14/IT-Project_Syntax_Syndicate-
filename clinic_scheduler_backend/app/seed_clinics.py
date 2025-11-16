from app.database import SessionLocal
from app.models.clinic import Clinic

db = SessionLocal()

clinics_to_add = [
    {"name": "PWF Health and Care Center", "address": "Johannesburg", "phone": "011-555-1000"},
    {"name": "Med Care", "address": "Pretoria", "phone": "012-888-9000"},
    {"name": "Ubuntu Clinic", "address": "Durban", "phone": "031-222-4400"},
    {"name": "Unjani Clinic", "address": "Cape Town", "phone": "021-300-5000"},
]

for c in clinics_to_add:
    existing = db.query(Clinic).filter(Clinic.name == c["name"]).first()
    if not existing:
        new_clinic = Clinic(**c)
        db.add(new_clinic)
        print("Added:", c["name"])

db.commit()
db.close()
print("Done seeding clinics")
