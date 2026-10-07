from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class HealthScoreComponents(BaseModel):
    """Component indicators and sub-scores for XAI explainability."""
    resolution_rate: float
    pending_rate: float
    long_pending_rate: float
    average_processing_days: float
    backlog_indicator: float
    
    # Sub-scores normalized to 0-100 scale
    resolution_rate_score: float
    pending_rate_score: float
    long_pending_rate_score: float
    processing_days_score: float
    backlog_score: float


class OverallHealthScoreResponse(BaseModel):
    """Overall system-level Implementation Health Score response schema."""
    total_claims: int
    approved_claims: int
    pending_claims: int
    rejected_claims: int
    resolved_claims: int
    long_pending_claims: int
    
    resolution_rate: float
    pending_rate: float
    long_pending_rate: float
    average_processing_days: float
    
    health_score: float
    health_category: str
    recommendation: str
    
    components: HealthScoreComponents


class DistrictHealthScoreResponse(BaseModel):
    """District-wise Implementation Health Score response schema."""
    district: str
    district_id: str
    
    total_claims: int
    approved_claims: int
    pending_claims: int
    rejected_claims: int
    resolved_claims: int
    long_pending_claims: int
    
    resolution_rate: float
    pending_rate: float
    long_pending_rate: float
    average_processing_days: float
    
    health_score: float
    health_category: str
    recommendation: str
    
    components: HealthScoreComponents


class DistrictHealthScoreListResponse(BaseModel):
    """List response containing district-wise health scores and overall summary."""
    total_districts: int
    overall: OverallHealthScoreResponse
    districts: List[DistrictHealthScoreResponse]


class DistrictPriorityScoreResponse(BaseModel):
    """District Priority Score item response schema."""
    district_id: str
    district: str
    district_name: str
    
    total_claims: int
    approved_claims: int
    pending_claims: int
    rejected_claims: int
    resolved_claims: int
    long_pending_claims: int
    
    pending_rate: float
    long_pending_rate: float
    resolution_rate: float
    average_processing_days: float
    pending_land_area_acres: float
    
    volume_score: float
    long_pending_score: float
    pending_rate_score: float
    processing_delay_score: float
    land_area_score: float
    
    priority_score: float
    priority_category: str
    recommendation: str


class DistrictPriorityRankingResponse(BaseModel):
    """District Priority Ranking list response schema."""
    total_districts: int
    districts: List[DistrictPriorityScoreResponse]


class ClaimDurationPredictionItem(BaseModel):
    """Claim Processing Duration Prediction item response schema (Module 3)."""
    claim_id: str
    district_id: str
    district: str
    mandal: str
    village: str
    claim_type: str
    land_area_acres: float
    submission_date: str
    
    current_pending_days: int
    predicted_processing_days: float
    prediction_difference_from_current: float
    prediction_state: str
    predicted_remaining_days: float
    delay_risk: str
    recommendation: str


class ClaimDurationPredictionListResponse(BaseModel):
    """Claim Processing Duration Prediction list response schema."""
    model_name: str
    model_type: str
    experimental: bool
    disclaimer: str
    validation_mae_days: float
    validation_r2: float
    total_pending_claims: int
    claims: List[ClaimDurationPredictionItem]


