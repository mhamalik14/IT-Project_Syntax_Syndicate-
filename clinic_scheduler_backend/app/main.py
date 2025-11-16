from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ==========================================================
# FASTAPI APP SETUP
# ==========================================================
app = FastAPI(title="Clinic Scheduler API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# INCLUDE ROUTERS
# ==========================================================
from .routers import appointments, auth  # Make sure this path matches your project structure
app.include_router(appointments.router)
app.include_router(auth.router)

from .routers import clinics
app.include_router(clinics.router)

from .routers import rooms
app.include_router(rooms.router)

from .routers import providers
app.include_router(providers.router)

@app.get("/")
def read_root():
    return {"message": "API is running!"}
