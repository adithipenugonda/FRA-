from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.claim import Claim
from app.schemas.claim import ClaimListResponse, ClaimResponse
from app.services.claim_service import get_claims


router = APIRouter(
    prefix="/claims",
    tags=["Claims"]
)


@router.get("/", response_model=ClaimListResponse)
def list_claims(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),

    district: str | None = Query(None),
    mandal: str | None = Query(None),
    village: str | None = Query(None),

    status: str | None = Query(None),
    claim_type: str | None = Query(None),
    search: str | None = Query(None),

    db: Session = Depends(get_db)
):
    total, claims = get_claims(
        db=db,
        page=page,
        limit=limit,
        district=district,
        mandal=mandal,
        village=village,
        status=status,
        claim_type=claim_type,
        search=search
    )

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": claims
    }


from sqlalchemy import text, Column, String, Numeric, Date, Integer

@router.get("/{claim_id}", response_model=ClaimResponse)
def get_claim_by_id(claim_id: str, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.claim_id == claim_id).first()
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Claim '{claim_id}' not found"
        )

    lat, lng = None, None
    if claim.geom is not None:
        try:
            point_json = db.scalar(text("SELECT ST_AsGeoJSON(geom) FROM claims WHERE claim_id = :id"), {"id": claim_id})
            if point_json:
                import json
                geojson = json.loads(point_json)
                coords = geojson.get("coordinates", [])
                if len(coords) >= 2:
                    lng, lat = float(coords[0]), float(coords[1])
        except Exception:
            pass

    return {
        "claim_id": claim.claim_id,
        "state": claim.state,
        "district_id": claim.district_id,
        "district": claim.district,
        "mandal": claim.mandal,
        "village": claim.village,
        "claimant_name": claim.claimant_name,
        "claim_type": claim.claim_type,
        "land_area_acres": float(claim.land_area_acres),
        "status": claim.status,
        "submission_date": claim.submission_date,
        "decision_date": claim.decision_date,
        "processing_days": claim.processing_days,
        "pending_days": claim.pending_days,
        "claim_age_days": claim.claim_age_days,
        "location_id": claim.location_id,
        "latitude": lat,
        "longitude": lng,
    }