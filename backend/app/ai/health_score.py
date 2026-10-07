"""
Implementation Health Score Calculation Engine for FRA Atlas.

This module provides reproducible, transparent, data-driven 0-100 scoring
for Forest Rights Act (FRA) implementation at system and district levels.
"""

from typing import Dict, Any, Tuple, Optional


def classify_health_score(score: float) -> Tuple[str, str]:
    """
    Classifies the 0-100 Implementation Health Score into operational categories
    and returns a tailored recommendation.

    Args:
        score: The calculated health score float (0-100).

    Returns:
        Tuple of (health_category, recommendation)
    """
    if score >= 80.0:
        category = "Healthy"
        recommendation = (
            "Implementation indicators are highly favorable with high resolution rates "
            "and minimal long-pending claim backlog."
        )
    elif score >= 60.0:
        category = "Moderate"
        recommendation = (
            "Implementation indicators are generally stable; regular monitoring of pending claims "
            "and processing timelines is advised."
        )
    elif score >= 40.0:
        category = "Needs Attention"
        recommendation = (
            "Pending workload and processing durations require operational intervention and "
            "targeted resource allocation to clear backlogs."
        )
    else:
        category = "Critical"
        recommendation = (
            "Implementation indicators show severe bottlenecks with high long-pending rates, "
            "requiring urgent administrative review and workflow escalation."
        )

    return category, recommendation


def calculate_health_score(
    total_claims: int,
    approved_claims: int,
    pending_claims: int,
    rejected_claims: int,
    long_pending_claims: int,
    average_processing_days: Optional[float],
) -> Dict[str, Any]:
    """
    Calculates the 0-100 Implementation Health Score based on 5 core indicators:
    1. Resolution Rate (25% weight): (Approved + Rejected) / Total * 100
    2. Pending Rate (20% weight): Pending / Total * 100 (inverse contribution)
    3. Long-Pending Rate (25% weight): Long-Pending (>=180d) / Total * 100 (inverse contribution)
    4. Processing Efficiency (15% weight): Average processing days for resolved claims
    5. Backlog Workload (15% weight): Relative non-pending claim proportion

    Handles zero-claim edge cases safely without division-by-zero errors.
    """
    if total_claims <= 0:
        return {
            "health_score": 0.0,
            "health_category": "Critical",
            "recommendation": "No claims recorded for scoring.",
            "resolution_rate": 0.0,
            "pending_rate": 0.0,
            "long_pending_rate": 0.0,
            "average_processing_days": 0.0,
            "components": {
                "resolution_rate": 0.0,
                "pending_rate": 0.0,
                "long_pending_rate": 0.0,
                "average_processing_days": 0.0,
                "backlog_indicator": 0.0,
                "resolution_rate_score": 0.0,
                "pending_rate_score": 0.0,
                "long_pending_rate_score": 0.0,
                "processing_days_score": 0.0,
                "backlog_score": 0.0,
            }
        }

    resolved_claims = approved_claims + rejected_claims
    
    # Core indicators
    resolution_rate = round((resolved_claims / total_claims) * 100.0, 2)
    pending_rate = round((pending_claims / total_claims) * 100.0, 2)
    long_pending_rate = round((long_pending_claims / total_claims) * 100.0, 2)
    avg_proc = round(average_processing_days, 2) if average_processing_days is not None else 0.0

    # Normalization (0 - 100)
    # A. Resolution Rate Score (Positive): 100% resolution = 100 pts
    s_res = min(100.0, max(0.0, resolution_rate))

    # B. Pending Rate Score (Negative): Lower pending rate = higher score
    s_pend = min(100.0, max(0.0, 100.0 - pending_rate))

    # C. Long-Pending Rate Score (Negative): Heavy penalty for >180 days claims
    s_long = min(100.0, max(0.0, 100.0 - (2.0 * long_pending_rate)))

    # D. Processing Days Score (Negative): Target processing <= 90d (100 pts), max threshold 720d (0 pts)
    if average_processing_days is not None and resolved_claims > 0:
        s_proc = min(100.0, max(0.0, 100.0 * (720.0 - avg_proc) / 720.0))
    else:
        # Neutral default if no resolved claims exist yet
        s_proc = 50.0

    # E. Backlog Workload Score: Proportion of non-pending claims
    s_backlog = min(100.0, max(0.0, 100.0 - pending_rate))

    # Composite Health Score Calculation (Weights: 0.25, 0.20, 0.25, 0.15, 0.15)
    composite_score = (
        (0.25 * s_res) +
        (0.20 * s_pend) +
        (0.25 * s_long) +
        (0.15 * s_proc) +
        (0.15 * s_backlog)
    )

    final_health_score = round(min(100.0, max(0.0, composite_score)), 2)
    category, recommendation = classify_health_score(final_health_score)

    return {
        "health_score": final_health_score,
        "health_category": category,
        "recommendation": recommendation,
        "resolution_rate": resolution_rate,
        "pending_rate": pending_rate,
        "long_pending_rate": long_pending_rate,
        "average_processing_days": avg_proc,
        "components": {
            "resolution_rate": resolution_rate,
            "pending_rate": pending_rate,
            "long_pending_rate": long_pending_rate,
            "average_processing_days": avg_proc,
            "backlog_indicator": pending_rate,
            "resolution_rate_score": round(s_res, 2),
            "pending_rate_score": round(s_pend, 2),
            "long_pending_rate_score": round(s_long, 2),
            "processing_days_score": round(s_proc, 2),
            "backlog_score": round(s_backlog, 2),
        }
    }
