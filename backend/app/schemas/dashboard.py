from typing import List, Optional
from pydantic import BaseModel


class StatusCount(BaseModel):
    status: str
    count: int


class TypeCount(BaseModel):
    claim_type: str
    count: int


class DistrictCount(BaseModel):
    district: str
    count: int
    total_land_area: float


class DistrictProcessing(BaseModel):
    district: str
    avg_processing_days: Optional[float] = None
    avg_pending_days: Optional[float] = None


class ProcessingSummary(BaseModel):
    avg_processing_days: Optional[float] = None
    avg_processing_approved: Optional[float] = None
    avg_processing_rejected: Optional[float] = None
    avg_pending_days: Optional[float] = None
    district_processing: List[DistrictProcessing] = []


class PendingWorkload(BaseModel):
    pending_claims: int
    long_pending_claims: int
    long_pending_threshold_days: int = 180
    average_pending_days: Optional[float] = None
    pending_ifr: int
    pending_cfr: int


class RecentClaimItem(BaseModel):
    claim_id: str
    district: str
    claim_type: str
    status: str
    submission_date: Optional[str] = None
    land_area_acres: float


class DistrictPendingItem(BaseModel):
    district: str
    pending_count: int


class DashboardSummaryResponse(BaseModel):
    total_claims: int
    approved_claims: int
    pending_claims: int
    rejected_claims: int
    total_land_area: float
    ifr_claims: int
    cfr_claims: int
    status_distribution: List[StatusCount]
    claim_type_distribution: List[TypeCount]
    district_distribution: List[DistrictCount]
    processing_summary: ProcessingSummary
    pending_workload: Optional[PendingWorkload] = None
    recent_claims: List[RecentClaimItem] = []
    district_pending_workload: List[DistrictPendingItem] = []

