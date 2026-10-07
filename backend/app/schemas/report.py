from typing import Any

from pydantic import BaseModel, ConfigDict


class ReportGenerateRequest(BaseModel):
    report_type: str = "overall"
    district: str | None = None
    claim_type: str | None = None


class ReportResponse(BaseModel):
    report_type: str
    title: str
    generated_at: str
    total_claims: int
    approved_count: int
    pending_count: int
    rejected_count: int
    ifr_count: int
    cfr_count: int
    district_statistics: list[dict[str, Any]] = []
    processing_statistics: dict[str, Any] = {}
    pending_workload: dict[str, Any] = {}
    observations: list[str] = []
    summary: str
    narrative: str | None = None

    model_config = ConfigDict(from_attributes=True)
