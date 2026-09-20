from datetime import date

from pydantic import BaseModel, ConfigDict


class ClaimResponse(BaseModel):
    claim_id: str
    state: str
    district_id: str
    district: str
    mandal: str
    village: str
    claimant_name: str
    claim_type: str
    land_area_acres: float
    status: str
    submission_date: date
    decision_date: date | None
    processing_days: int | None
    pending_days: int | None
    claim_age_days: int | None
    location_id: str | None
    latitude: float | None = None
    longitude: float | None = None

    model_config = ConfigDict(from_attributes=True)


class ClaimListResponse(BaseModel):
    total: int
    page: int
    limit: int
    items: list[ClaimResponse]