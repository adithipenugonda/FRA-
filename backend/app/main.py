from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.database import engine
from app.api.routes.claims import router as claims_router
from app.api.routes.claim_history import router as claim_history_router
from app.api.routes.documents import router as documents_router
from app.api.routes.assistant import router as assistant_router
from app.api.routes.reports import router as reports_router
from app.api.routes.map import router as map_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.auth import router as auth_router
from app.services.auth_seed import init_db_and_seed_users

# Run table initialization and user seeding
init_db_and_seed_users()

app = FastAPI(
    title="FRA Atlas API",
    description="Backend API for FRA Atlas WebGIS and Decision Support System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(claims_router)
app.include_router(claim_history_router)
app.include_router(documents_router)
app.include_router(assistant_router)
app.include_router(reports_router)
app.include_router(map_router)
app.include_router(dashboard_router)
app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "FRA Atlas API is running"
    }


@app.get("/health/db")
def database_health():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            value = result.scalar()

        return {
            "database": "connected",
            "test_result": value
        }

    except Exception as e:
        return {
            "database": "connection_failed",
            "error": str(e)
        }