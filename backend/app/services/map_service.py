from sqlalchemy import text
from sqlalchemy.orm import Session
import json


def get_claims_geojson(
    db: Session,
    district: str | None = None,
    mandal: str | None = None,
    village: str | None = None,
    status: str | None = None,
    claim_type: str | None = None,
    limit: int = 500
):
    query = """
        SELECT
            claim_id,
            state,
            district_id,
            district,
            mandal,
            village,
            claimant_name,
            claim_type,
            land_area_acres,
            status,
            submission_date,
            decision_date,
            processing_days,
            pending_days,
            claim_age_days,
            location_id,
            ST_AsGeoJSON(geom) AS geometry
        FROM claims
        WHERE geom IS NOT NULL
    """

    parameters = {}

    if district:
        query += " AND district ILIKE :district"
        parameters["district"] = district

    if mandal:
        query += " AND mandal ILIKE :mandal"
        parameters["mandal"] = mandal

    if village:
        query += " AND village ILIKE :village"
        parameters["village"] = village

    if status:
        query += " AND status ILIKE :status"
        parameters["status"] = status

    if claim_type:
        query += " AND claim_type ILIKE :claim_type"
        parameters["claim_type"] = claim_type

    query += " ORDER BY claim_id LIMIT :limit"
    parameters["limit"] = limit

    result = db.execute(
        text(query),
        parameters
    )

    features = []

    for row in result.mappings():

        properties = {
            "claim_id": row["claim_id"],
            "state": row["state"],
            "district_id": row["district_id"],
            "district": row["district"],
            "mandal": row["mandal"],
            "village": row["village"],
            "claimant_name": row["claimant_name"],
            "claim_type": row["claim_type"],
            "land_area_acres": float(row["land_area_acres"]),
            "status": row["status"],
            "submission_date": (
                row["submission_date"].isoformat()
                if row["submission_date"]
                else None
            ),
            "decision_date": (
                row["decision_date"].isoformat()
                if row["decision_date"]
                else None
            ),
            "processing_days": row["processing_days"],
            "pending_days": row["pending_days"],
            "claim_age_days": row["claim_age_days"],
            "location_id": row["location_id"]
        }

        features.append({
    "type": "Feature",
    "geometry": json.loads(row["geometry"]),
    "properties": properties
})

    return {
        "type": "FeatureCollection",
        "features": features
    }