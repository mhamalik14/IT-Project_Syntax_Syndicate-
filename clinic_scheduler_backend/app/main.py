from fastapi import FastAPI
from app.routers import appointments, auth

app = FastAPI(title="Clinic Scheduling API")

app.include_router(auth.router)
app.include_router(appointments.router)

@app.get("/")
def root():
    return {"message": "Clinic Scheduling API running"}
