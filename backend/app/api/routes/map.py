from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.map_service import get_claims_geojson


router = APIRouter(
    prefix="/map",
    tags=["WebGIS"]
)


@router.get("/claims")
def map_claims(
    district: str | None = Query(None),
    mandal: str | None = Query(None),
    village: str | None = Query(None),
    status: str | None = Query(None),
    claim_type: str | None = Query(None),

    limit: int = Query(500, ge=1, le=1000),

    db: Session = Depends(get_db)
):
    return get_claims_geojson(
        db=db,
        district=district,
        mandal=mandal,
        village=village,
        status=status,
        claim_type=claim_type,
        limit=limit
    )