from __future__ import annotations

from datetime import datetime

from sqlalchemy import text
from sqlalchemy.orm import Session


VALID_REPORT_TYPES = {"overall", "pending", "district", "processing", "type", "status"}


def _safe_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def generate_claim_report(db: Session, report_type: str = "overall", district: str | None = None, claim_type: str | None = None) -> dict:
    type_key = (report_type or "overall").strip().lower()
    if type_key not in VALID_REPORT_TYPES:
        raise ValueError(f"Unsupported report type '{report_type}'. Supported values: {', '.join(sorted(VALID_REPORT_TYPES))}")

    q = """
        SELECT
            COUNT(*) AS total_claims,
            COUNT(*) FILTER (WHERE LOWER(status) = 'approved') AS approved_count,
            COUNT(*) FILTER (WHERE LOWER(status) = 'pending') AS pending_count,
            COUNT(*) FILTER (WHERE LOWER(status) = 'rejected') AS rejected_count,
            COUNT(*) FILTER (WHERE UPPER(claim_type) = 'IFR') AS ifr_count,
            COUNT(*) FILTER (WHERE UPPER(claim_type) = 'CFR') AS cfr_count,
            ROUND(AVG(processing_days)::numeric, 1) AS avg_processing_days,
            ROUND(AVG(pending_days)::numeric, 1) AS avg_pending_days
        FROM claims
    """
    if district:
        q += " WHERE LOWER(district) = :district "
    elif claim_type:
        q += " WHERE UPPER(claim_type) = :claim_type "

    row = db.execute(text(q), {"district": district.lower() if district else None, "claim_type": (claim_type or "").upper() if claim_type else None}).mappings().first()

    status_distribution = db.execute(text("SELECT status, COUNT(*) AS count FROM claims WHERE status IS NOT NULL GROUP BY status ORDER BY count DESC")).mappings().all()
    district_stats = db.execute(text("SELECT district, COUNT(*) AS total_count, COUNT(*) FILTER (WHERE LOWER(status) = 'pending') AS pending_count FROM claims WHERE district IS NOT NULL GROUP BY district ORDER BY total_count DESC, district ASC LIMIT 10")).mappings().all()
    pending_workload = db.execute(text("SELECT COUNT(*) AS pending_claims, COUNT(*) FILTER (WHERE pending_days > 180) AS old_pending_claims, ROUND(AVG(pending_days)::numeric, 1) AS avg_pending_days FROM claims WHERE LOWER(status) = 'pending'")).mappings().first()

    total_claims = row["total_claims"] or 0
    approved_count = row["approved_count"] or 0
    pending_count = row["pending_count"] or 0
    rejected_count = row["rejected_count"] or 0
    ifr_count = row["ifr_count"] or 0
    cfr_count = row["cfr_count"] or 0

    observations = []
    if pending_count:
        observations.append(f"{pending_count} claims remain pending and require operational attention.")
    if old_pending := (pending_workload["old_pending_claims"] or 0):
        observations.append(f"{old_pending} pending claims have been awaiting action for more than 180 days.")
    if ifr_count or cfr_count:
        observations.append(f"IFR and CFR composition currently stands at {ifr_count} IFR and {cfr_count} CFR claims.")
    if not observations:
        observations.append("No operational issues were identified in the current dataset.")

    summary = (
        f"This {report_type} FRA claims report covers {total_claims} claims, with {approved_count} approved, {pending_count} pending, and {rejected_count} rejected. "
        f"The database shows {ifr_count} IFR claims and {cfr_count} CFR claims."
    )

    return {
        "report_type": type_key,
        "title": f"FRA Atlas {report_type.title()} Claims Report",
        "generated_at": datetime.utcnow().isoformat(timespec="seconds") + "Z",
        "total_claims": int(total_claims),
        "approved_count": int(approved_count),
        "pending_count": int(pending_count),
        "rejected_count": int(rejected_count),
        "ifr_count": int(ifr_count),
        "cfr_count": int(cfr_count),
        "district_statistics": [dict(r) for r in district_stats],
        "processing_statistics": {
            "average_processing_days": _safe_float(row["avg_processing_days"]),
            "average_pending_days": _safe_float(row["avg_pending_days"]),
        },
        "pending_workload": {
            "pending_claims": int(pending_workload["pending_claims"] or 0),
            "old_pending_claims": int(pending_workload["old_pending_claims"] or 0),
            "average_pending_days": _safe_float(pending_workload["avg_pending_days"]),
        },
        "observations": observations,
        "summary": summary,
        "narrative": summary,
        "status_distribution": [dict(r) for r in status_distribution],
    }
