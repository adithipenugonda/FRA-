"""
AI Service layer providing implementation health score & priority ranking calculations via database aggregation.
"""

from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func, case

from app.models.claim import Claim
from app.ai.health_score import calculate_health_score
from app.ai.priority_score import compute_db_district_priority_scores


def get_overall_health_score(db: Session) -> Dict[str, Any]:
    """
    Computes overall system-level Implementation Health Score across all FRA claims in the database.
    Performs aggregated database query for high efficiency.
    """
    row = db.query(
        func.count(Claim.claim_id).label("total_claims"),
        func.sum(case((Claim.status == "Approved", 1), else_=0)).label("approved_claims"),
        func.sum(case((Claim.status == "Pending", 1), else_=0)).label("pending_claims"),
        func.sum(case((Claim.status == "Rejected", 1), else_=0)).label("rejected_claims"),
        func.sum(case((Claim.status.in_(["Approved", "Rejected"]), 1), else_=0)).label("resolved_claims"),
        func.sum(case(((Claim.status == "Pending") & (Claim.pending_days >= 180), 1), else_=0)).label("long_pending_claims"),
        func.avg(case((Claim.status.in_(["Approved", "Rejected"]), Claim.processing_days), else_=None)).label("avg_processing_days"),
    ).one()

    total_claims = int(row.total_claims or 0)
    approved_claims = int(row.approved_claims or 0)
    pending_claims = int(row.pending_claims or 0)
    rejected_claims = int(row.rejected_claims or 0)
    resolved_claims = int(row.resolved_claims or 0)
    long_pending_claims = int(row.long_pending_claims or 0)
    avg_proc = float(row.avg_processing_days) if row.avg_processing_days is not None else None

    score_calc = calculate_health_score(
        total_claims=total_claims,
        approved_claims=approved_claims,
        pending_claims=pending_claims,
        rejected_claims=rejected_claims,
        long_pending_claims=long_pending_claims,
        average_processing_days=avg_proc,
    )

    return {
        "total_claims": total_claims,
        "approved_claims": approved_claims,
        "pending_claims": pending_claims,
        "rejected_claims": rejected_claims,
        "resolved_claims": resolved_claims,
        "long_pending_claims": long_pending_claims,
        "resolution_rate": score_calc["resolution_rate"],
        "pending_rate": score_calc["pending_rate"],
        "long_pending_rate": score_calc["long_pending_rate"],
        "average_processing_days": score_calc["average_processing_days"],
        "health_score": score_calc["health_score"],
        "health_category": score_calc["health_category"],
        "recommendation": score_calc["recommendation"],
        "components": score_calc["components"],
    }


def get_district_health_scores(db: Session) -> Dict[str, Any]:
    """
    Computes Implementation Health Score separately for every district in the database,
    along with overall system summary.
    """
    # 1. Fetch overall summary first
    overall_summary = get_overall_health_score(db)

    # 2. Fetch district aggregated metrics
    rows = db.query(
        Claim.district,
        Claim.district_id,
        func.count(Claim.claim_id).label("total_claims"),
        func.sum(case((Claim.status == "Approved", 1), else_=0)).label("approved_claims"),
        func.sum(case((Claim.status == "Pending", 1), else_=0)).label("pending_claims"),
        func.sum(case((Claim.status == "Rejected", 1), else_=0)).label("rejected_claims"),
        func.sum(case((Claim.status.in_(["Approved", "Rejected"]), 1), else_=0)).label("resolved_claims"),
        func.sum(case(((Claim.status == "Pending") & (Claim.pending_days >= 180), 1), else_=0)).label("long_pending_claims"),
        func.avg(case((Claim.status.in_(["Approved", "Rejected"]), Claim.processing_days), else_=None)).label("avg_processing_days"),
    ).group_by(Claim.district, Claim.district_id).order_by(Claim.district).all()

    districts_list: List[Dict[str, Any]] = []

    for r in rows:
        total_claims = int(r.total_claims or 0)
        approved_claims = int(r.approved_claims or 0)
        pending_claims = int(r.pending_claims or 0)
        rejected_claims = int(r.rejected_claims or 0)
        resolved_claims = int(r.resolved_claims or 0)
        long_pending_claims = int(r.long_pending_claims or 0)
        avg_proc = float(r.avg_processing_days) if r.avg_processing_days is not None else None

        calc = calculate_health_score(
            total_claims=total_claims,
            approved_claims=approved_claims,
            pending_claims=pending_claims,
            rejected_claims=rejected_claims,
            long_pending_claims=long_pending_claims,
            average_processing_days=avg_proc,
        )

        districts_list.append({
            "district": r.district,
            "district_id": r.district_id,
            "total_claims": total_claims,
            "approved_claims": approved_claims,
            "pending_claims": pending_claims,
            "rejected_claims": rejected_claims,
            "resolved_claims": resolved_claims,
            "long_pending_claims": long_pending_claims,
            "resolution_rate": calc["resolution_rate"],
            "pending_rate": calc["pending_rate"],
            "long_pending_rate": calc["long_pending_rate"],
            "average_processing_days": calc["average_processing_days"],
            "health_score": calc["health_score"],
            "health_category": calc["health_category"],
            "recommendation": calc["recommendation"],
            "components": calc["components"],
        })

    return {
        "total_districts": len(districts_list),
        "overall": overall_summary,
        "districts": districts_list,
    }


def get_district_priority_ranking(db: Session) -> Dict[str, Any]:
    """
    Computes District Priority Ranking for all districts using the Priority Score engine.
    Returns districts sorted by priority_score descending.
    """
    priority_list = compute_db_district_priority_scores(db)
    return {
        "total_districts": len(priority_list),
        "districts": priority_list,
    }


def get_claim_duration_predictions(db: Session) -> Dict[str, Any]:
    """
    Retrieves experimental processing duration predictions for all active pending claims (Module 3).
    """
    from app.ai.prediction import predict_pending_claims_duration
    return predict_pending_claims_duration(db)

