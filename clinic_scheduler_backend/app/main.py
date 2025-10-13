from fastapi import FastAPI
from app.routers import appointments

app = FastAPI(title="Clinic Scheduling API")

# include routers
app.include_router(appointments.router)

@app.get("/")
def root():
    return {"message": "Clinic Scheduling API running"}
