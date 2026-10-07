"""
District Priority Score Calculation Engine for FRA Atlas (AI/DSS Module 2).

This module calculates reproducible, data-driven 0-100 Priority Scores
for Forest Rights Act (FRA) implementation at the district level.
Higher Priority Score = Higher Urgency for Administrative Action.
"""

from typing import Dict, Any, List, Tuple, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, case

from app.models.claim import Claim


def classify_priority_score(score: float) -> Tuple[str, str]:
    """
    Classifies the 0-100 District Priority Score into action categories
    and returns a tailored operational recommendation.

    Args:
        score: The calculated Priority Score float (0-100).

    Returns:
        Tuple of (priority_category, recommendation)
    """
    if score >= 80.0:
        category = "Critical Priority"
        recommendation = (
            "High pending claim volume and severe long pendency require urgent administrative "
            "intervention, officer reallocation, and fast-tracked DLC review."
        )
    elif score >= 60.0:
        category = "High Priority"
        recommendation = (
            "Significant pending workload and processing delays detected; priority resource "
            "allocation and weekly pendency tracking advised."
        )
    elif score >= 40.0:
        category = "Medium Priority"
        recommendation = (
            "Moderate pending workload; standard monitoring and periodic workflow check-ins "
            "are recommended."
        )
    else:
        category = "Low Priority"
        recommendation = (
            "Implementation running smoothly with low pending backlog and rapid turnaround; "
            "minimal intervention required."
        )

    return category, recommendation


def calculate_district_priority_scores(districts_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Calculates 0-100 Priority Scores for a list of raw aggregated district metrics.

    Uses 5 weighted indicators:
    1. Pending Workload Volume (25% weight): pending_claims / max_pending_claims * 100
    2. Long-Pending Risk (25% weight): min(100, long_pending_rate * 1.5)
    3. Pending Workload Proportion (20% weight): min(100, pending_rate)
    4. Processing Delay (15% weight): min(100, max(0, ((avg_proc_days - 30) / 335) * 100))
    5. Pending Land Area Impact (15% weight): pending_land_area / max_pending_land_area * 100

    Handles zero-pending, zero-max, and NULL values safely without division by zero.
    """
    if not districts_data:
        return []

    # Pass 1: Find maximum values across all districts for relative normalization
    max_pending_claims = max([int(d.get("pending_claims", 0) or 0) for d in districts_data], default=0)
    max_pending_land_area = max([float(d.get("pending_land_area_acres", 0.0) or 0.0) for d in districts_data], default=0.0)

    calculated_list: List[Dict[str, Any]] = []

    # Pass 2: Calculate indicator scores & final composite priority score
    for d in districts_data:
        total_claims = max(0, int(d.get("total_claims", 0) or 0))
        approved_claims = max(0, int(d.get("approved_claims", 0) or 0))
        pending_claims = max(0, int(d.get("pending_claims", 0) or 0))
        rejected_claims = max(0, int(d.get("rejected_claims", 0) or 0))
        resolved_claims = approved_claims + rejected_claims
        long_pending_claims = max(0, int(d.get("long_pending_claims", 0) or 0))
        pending_land_area = max(0.0, float(d.get("pending_land_area_acres", 0.0) or 0.0))

        raw_avg_proc = d.get("average_processing_days")
        avg_proc_days = float(raw_avg_proc) if raw_avg_proc is not None else None

        # Calculate percentage rates safely
        if total_claims > 0:
            pending_rate = round((pending_claims / total_claims) * 100.0, 2)
            long_pending_rate = round((long_pending_claims / total_claims) * 100.0, 2)
            resolution_rate = round((resolved_claims / total_claims) * 100.0, 2)
        else:
            pending_rate = 0.0
            long_pending_rate = 0.0
            resolution_rate = 0.0

        # Normalization (0 - 100 scale for each sub-indicator)
        # 1. Pending Workload Volume Score
        if max_pending_claims > 0:
            p_vol = (pending_claims / max_pending_claims) * 100.0
        else:
            p_vol = 0.0
        p_vol = min(100.0, max(0.0, p_vol))

        # 2. Long-Pending Risk Score
        p_long = min(100.0, max(0.0, long_pending_rate * 1.5))

        # 3. Pending Workload Proportion Score
        p_pend_rate = min(100.0, max(0.0, pending_rate))

        # 4. Processing Delay Score (30 days = 0 pts, >= 365 days = 100 pts)
        if avg_proc_days is not None and avg_proc_days > 0:
            p_delay = ((avg_proc_days - 30.0) / 335.0) * 100.0
            p_delay = min(100.0, max(0.0, p_delay))
        else:
            p_delay = 0.0

        # 5. Pending Land Area Impact Score
        if max_pending_land_area > 0.0:
            p_area = (pending_land_area / max_pending_land_area) * 100.0
        else:
            p_area = 0.0
        p_area = min(100.0, max(0.0, p_area))

        # Composite Priority Score (Weights: 0.25, 0.25, 0.20, 0.15, 0.15)
        composite = (
            (0.25 * p_vol) +
            (0.25 * p_long) +
            (0.20 * p_pend_rate) +
            (0.15 * p_delay) +
            (0.15 * p_area)
        )

        priority_score = round(min(100.0, max(0.0, composite)), 1)
        category, recommendation = classify_priority_score(priority_score)

        district_name = str(d.get("district_name", d.get("district", "")))
        district_id = str(d.get("district_id", ""))

        calculated_list.append({
            "district_id": district_id,
            "district": district_name,
            "district_name": district_name,
            "total_claims": total_claims,
            "approved_claims": approved_claims,
            "pending_claims": pending_claims,
            "rejected_claims": rejected_claims,
            "resolved_claims": resolved_claims,
            "long_pending_claims": long_pending_claims,
            "pending_rate": pending_rate,
            "long_pending_rate": long_pending_rate,
            "resolution_rate": resolution_rate,
            "average_processing_days": round(avg_proc_days, 2) if avg_proc_days is not None else 0.0,
            "pending_land_area_acres": round(pending_land_area, 2),
            "volume_score": round(p_vol, 2),
            "long_pending_score": round(p_long, 2),
            "pending_rate_score": round(p_pend_rate, 2),
            "processing_delay_score": round(p_delay, 2),
            "land_area_score": round(p_area, 2),
            "priority_score": priority_score,
            "priority_category": category,
            "recommendation": recommendation,
        })

    return calculated_list


def compute_db_district_priority_scores(db: Session) -> List[Dict[str, Any]]:
    """
    Executes database aggregation on PostgreSQL claims table and returns
    calculated Priority Scores for all districts sorted by priority_score descending.
    """
    rows = db.query(
        Claim.district_id,
        Claim.district.label("district_name"),
        func.count(Claim.claim_id).label("total_claims"),
        func.sum(case((Claim.status == "Approved", 1), else_=0)).label("approved_claims"),
        func.sum(case((Claim.status == "Pending", 1), else_=0)).label("pending_claims"),
        func.sum(case((Claim.status == "Rejected", 1), else_=0)).label("rejected_claims"),
        func.sum(case(((Claim.status == "Pending") & (Claim.pending_days >= 180), 1), else_=0)).label("long_pending_claims"),
        func.avg(case((Claim.status.in_(["Approved", "Rejected"]), Claim.processing_days), else_=None)).label("avg_processing_days"),
        func.sum(case((Claim.status == "Pending", Claim.land_area_acres), else_=0)).label("pending_land_area_acres"),
    ).group_by(Claim.district_id, Claim.district).order_by(Claim.district).all()

    raw_districts = []
    for r in rows:
        raw_districts.append({
            "district_id": r.district_id,
            "district_name": r.district_name,
            "total_claims": int(r.total_claims or 0),
            "approved_claims": int(r.approved_claims or 0),
            "pending_claims": int(r.pending_claims or 0),
            "rejected_claims": int(r.rejected_claims or 0),
            "long_pending_claims": int(r.long_pending_claims or 0),
            "average_processing_days": float(r.avg_processing_days) if r.avg_processing_days is not None else None,
            "pending_land_area_acres": float(r.pending_land_area_acres or 0.0),
        })

    result = calculate_district_priority_scores(raw_districts)
    # Sort descending by priority_score
    result.sort(key=lambda x: x["priority_score"], reverse=True)
    return result
