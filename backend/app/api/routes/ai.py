from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.ai import (
    OverallHealthScoreResponse,
    DistrictHealthScoreListResponse,
    DistrictPriorityRankingResponse,
    ClaimDurationPredictionListResponse,
)
from app.services.ai_service import (
    get_overall_health_score,
    get_district_health_scores,
    get_district_priority_ranking,
    get_claim_duration_predictions,
)

router = APIRouter(prefix="/ai", tags=["AI Decision Support System"])


@router.get(
    "/health-score",
    response_model=OverallHealthScoreResponse,
    summary="Get overall Implementation Health Score",
    description="Calculates system-level 0-100 Implementation Health Score from all FRA claims.",
)
def read_overall_health_score(db: Session = Depends(get_db)):
    return get_overall_health_score(db)


@router.get(
    "/health-score/districts",
    response_model=DistrictHealthScoreListResponse,
    summary="Get district-wise Implementation Health Scores",
    description="Calculates 0-100 Implementation Health Score separately for every district.",
)
def read_district_health_scores(db: Session = Depends(get_db)):
    return get_district_health_scores(db)


@router.get(
    "/priority-ranking",
    response_model=DistrictPriorityRankingResponse,
    summary="Get district priority ranking",
    description="Calculates 0-100 Priority Scores for all districts, sorted highest priority first.",
)
def read_district_priority_ranking(db: Session = Depends(get_db)):
    return get_district_priority_ranking(db)


@router.get(
    "/prediction/claims",
    response_model=ClaimDurationPredictionListResponse,
    summary="Get processing duration predictions for pending claims",
    description="Returns experimental processing duration estimates and delay risk for active pending claims using submission-time features.",
)
def read_claim_duration_predictions(db: Session = Depends(get_db)):
    return get_claim_duration_predictions(db)

