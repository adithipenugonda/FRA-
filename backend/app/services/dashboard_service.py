from sqlalchemy import text
from sqlalchemy.orm import Session


def get_dashboard_summary(db: Session):
    # 1. Summary Totals (Counts, Sums, Pending Breakdown)
    totals_query = """
        SELECT
            COUNT(*) AS total_claims,
            COUNT(*) FILTER (WHERE LOWER(status) = 'approved') AS approved_claims,
            COUNT(*) FILTER (WHERE LOWER(status) = 'pending') AS pending_claims,
            COUNT(*) FILTER (WHERE LOWER(status) = 'rejected') AS rejected_claims,
            COALESCE(SUM(land_area_acres), 0) AS total_land_area,
            COUNT(*) FILTER (WHERE LOWER(claim_type) = 'ifr') AS ifr_claims,
            COUNT(*) FILTER (WHERE LOWER(claim_type) = 'cfr') AS cfr_claims,
            COUNT(*) FILTER (WHERE LOWER(status) = 'pending' AND pending_days >= 180) AS long_pending_claims,
            COUNT(*) FILTER (WHERE LOWER(status) = 'pending' AND LOWER(claim_type) = 'ifr') AS pending_ifr,
            COUNT(*) FILTER (WHERE LOWER(status) = 'pending' AND LOWER(claim_type) = 'cfr') AS pending_cfr
        FROM claims
    """
    totals_row = db.execute(text(totals_query)).mappings().first()

    # 2. Status Distribution
    status_query = """
        SELECT
            status,
            COUNT(*) AS count
        FROM claims
        WHERE status IS NOT NULL
        GROUP BY status
        ORDER BY count DESC
    """
    status_result = db.execute(text(status_query)).mappings().all()
    status_distribution = [
        {"status": r["status"], "count": r["count"]}
        for r in status_result
    ]

    # 3. Claim Type Distribution
    type_query = """
        SELECT
            claim_type,
            COUNT(*) AS count
        FROM claims
        WHERE claim_type IS NOT NULL
        GROUP BY claim_type
        ORDER BY count DESC
    """
    type_result = db.execute(text(type_query)).mappings().all()
    claim_type_distribution = [
        {"claim_type": r["claim_type"], "count": r["count"]}
        for r in type_result
    ]

    # 4. District-wise Claim Distribution
    district_query = """
        SELECT
            district,
            COUNT(*) AS count,
            COALESCE(SUM(land_area_acres), 0) AS total_land_area
        FROM claims
        WHERE district IS NOT NULL
        GROUP BY district
        ORDER BY count DESC
    """
    district_result = db.execute(text(district_query)).mappings().all()
    district_distribution = [
        {
            "district": r["district"],
            "count": r["count"],
            "total_land_area": round(float(r["total_land_area"]), 2),
        }
        for r in district_result
    ]

    # 5. Processing & Pending Days Summary
    processing_overall_query = """
        SELECT
            ROUND(AVG(processing_days)::numeric, 1) AS avg_processing_days,
            ROUND(AVG(processing_days) FILTER (WHERE LOWER(status) = 'approved')::numeric, 1) AS avg_processing_approved,
            ROUND(AVG(processing_days) FILTER (WHERE LOWER(status) = 'rejected')::numeric, 1) AS avg_processing_rejected,
            ROUND(AVG(pending_days) FILTER (WHERE LOWER(status) = 'pending')::numeric, 1) AS avg_pending_days
        FROM claims
    """
    proc_row = db.execute(text(processing_overall_query)).mappings().first()

    district_proc_query = """
        SELECT
            district,
            ROUND(AVG(processing_days)::numeric, 1) AS avg_processing_days,
            ROUND(AVG(pending_days)::numeric, 1) AS avg_pending_days
        FROM claims
        WHERE district IS NOT NULL
        GROUP BY district
        ORDER BY district
    """
    district_proc_result = db.execute(text(district_proc_query)).mappings().all()
    district_processing = [
        {
            "district": r["district"],
            "avg_processing_days": (
                float(r["avg_processing_days"])
                if r["avg_processing_days"] is not None
                else None
            ),
            "avg_pending_days": (
                float(r["avg_pending_days"])
                if r["avg_pending_days"] is not None
                else None
            ),
        }
        for r in district_proc_result
    ]

    processing_summary = {
        "avg_processing_days": (
            float(proc_row["avg_processing_days"])
            if proc_row and proc_row["avg_processing_days"] is not None
            else 0.0
        ),
        "avg_processing_approved": (
            float(proc_row["avg_processing_approved"])
            if proc_row and proc_row["avg_processing_approved"] is not None
            else 0.0
        ),
        "avg_processing_rejected": (
            float(proc_row["avg_processing_rejected"])
            if proc_row and proc_row["avg_processing_rejected"] is not None
            else 0.0
        ),
        "avg_pending_days": (
            float(proc_row["avg_pending_days"])
            if proc_row and proc_row["avg_pending_days"] is not None
            else 0.0
        ),
        "district_processing": district_processing,
    }

    # 6. Officer Operational Monitoring: Recent Claims (Top 5 by submission_date DESC)
    recent_query = """
        SELECT
            claim_id,
            district,
            claim_type,
            status,
            TO_CHAR(submission_date, 'YYYY-MM-DD') AS submission_date,
            COALESCE(land_area_acres, 0) AS land_area_acres
        FROM claims
        ORDER BY submission_date DESC, claim_id ASC
        LIMIT 5
    """
    recent_result = db.execute(text(recent_query)).mappings().all()
    recent_claims = [
        {
            "claim_id": r["claim_id"],
            "district": r["district"],
            "claim_type": r["claim_type"],
            "status": r["status"],
            "submission_date": r["submission_date"],
            "land_area_acres": round(float(r["land_area_acres"]), 2),
        }
        for r in recent_result
    ]

    # 7. Officer Operational Monitoring: Top 5 District Pending Workload
    district_pending_query = """
        SELECT
            district,
            COUNT(*) AS pending_count
        FROM claims
        WHERE LOWER(status) = 'pending' AND district IS NOT NULL
        GROUP BY district
        ORDER BY pending_count DESC
        LIMIT 5
    """
    district_pending_result = db.execute(text(district_pending_query)).mappings().all()
    district_pending_workload = [
        {
            "district": r["district"],
            "pending_count": r["pending_count"],
        }
        for r in district_pending_result
    ]

    # Pending Workload Object
    pending_workload = {
        "pending_claims": totals_row["pending_claims"] or 0,
        "long_pending_claims": totals_row["long_pending_claims"] or 0,
        "long_pending_threshold_days": 180,
        "average_pending_days": (
            float(proc_row["avg_pending_days"])
            if proc_row and proc_row["avg_pending_days"] is not None
            else 0.0
        ),
        "pending_ifr": totals_row["pending_ifr"] or 0,
        "pending_cfr": totals_row["pending_cfr"] or 0,
    }

    return {
        "total_claims": totals_row["total_claims"] or 0,
        "approved_claims": totals_row["approved_claims"] or 0,
        "pending_claims": totals_row["pending_claims"] or 0,
        "rejected_claims": totals_row["rejected_claims"] or 0,
        "total_land_area": round(float(totals_row["total_land_area"] or 0), 2),
        "ifr_claims": totals_row["ifr_claims"] or 0,
        "cfr_claims": totals_row["cfr_claims"] or 0,
        "status_distribution": status_distribution,
        "claim_type_distribution": claim_type_distribution,
        "district_distribution": district_distribution,
        "processing_summary": processing_summary,
        "pending_workload": pending_workload,
        "recent_claims": recent_claims,
        "district_pending_workload": district_pending_workload,
    }

