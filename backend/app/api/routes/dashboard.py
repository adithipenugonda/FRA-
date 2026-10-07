from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user, require_admin_role
from app.core.database import get_db
from app.models.user import User
from app.services.dashboard_service import get_dashboard_summary
from app.schemas.dashboard import DashboardSummaryResponse

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/summary", response_model=DashboardSummaryResponse)
def dashboard_summary(db: Session = Depends(get_db)):
    return get_dashboard_summary(db=db)


@router.get("/officer")
def officer_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total_claims = db.execute(text("SELECT COUNT(*) FROM claims")).scalar() or 0
    approved = db.execute(text("SELECT COUNT(*) FROM claims WHERE LOWER(status) = 'approved'")).scalar() or 0
    rejected = db.execute(text("SELECT COUNT(*) FROM claims WHERE LOWER(status) = 'rejected'")).scalar() or 0
    pending = db.execute(text("SELECT COUNT(*) FROM claims WHERE LOWER(status) = 'pending'")).scalar() or 0
    avg_processing = db.execute(text("SELECT ROUND(AVG(processing_days)::numeric, 1) FROM claims WHERE processing_days IS NOT NULL")).scalar()
    pending_workload = db.execute(text("SELECT COUNT(*) FROM claims WHERE LOWER(status) = 'pending' AND pending_days > 180")).scalar() or 0

    recent_activity = db.execute(text("SELECT claim_id, status, previous_status, changed_by, changed_at FROM claim_history ORDER BY changed_at DESC LIMIT 10")).mappings().all()
    activity_payload = []
    for row in recent_activity:
        actor = db.execute(text("SELECT username FROM users WHERE id = :user_id"), {"user_id": row["changed_by"]}).scalar()
        activity_payload.append({
            "claim_id": row["claim_id"],
            "status": row["new_status"] if "new_status" in row.keys() else row["status"],
            "previous_status": row["previous_status"],
            "changed_by": actor,
            "changed_at": str(row["changed_at"]),
        })

    return {
        "user": {"id": current_user.id, "username": current_user.username, "role": current_user.role},
        "all_claims": total_claims,
        "approved_claims": approved,
        "rejected_claims": rejected,
        "pending_claims": pending,
        "average_processing_days": float(avg_processing) if avg_processing is not None else 0.0,
        "long_pending_workload": pending_workload,
        "recent_activity": activity_payload,
        "data_quality": "Historical attribution is available only when claim history records include a user reference.",
    }


@router.get("/officers")
def officers_dashboard(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin_role),
):
    officers = db.execute(text("SELECT id, username, role FROM users WHERE role IN ('officer', 'admin') ORDER BY username")).mappings().all()
    rows = []
    for officer in officers:
        officer_id = officer["id"]
        total_updates = db.execute(text("SELECT COUNT(*) FROM claim_history WHERE changed_by = :user_id"), {"user_id": officer_id}).scalar() or 0
        distinct_claims = db.execute(text("SELECT COUNT(DISTINCT claim_id) FROM claim_history WHERE changed_by = :user_id"), {"user_id": officer_id}).scalar() or 0
        pending_assigned = db.execute(text("SELECT COUNT(*) FROM claims c JOIN claim_history ch ON ch.claim_id = c.claim_id WHERE ch.changed_by = :user_id AND LOWER(c.status) = 'pending'"), {"user_id": officer_id}).scalar() or 0
        rows.append({
            "id": officer_id,
            "username": officer["username"],
            "role": officer["role"],
            "total_status_updates": total_updates,
            "claims_handled": distinct_claims,
            "pending_workload": pending_assigned,
        })

    return {
        "admins_only": True,
        "officers": rows,
        "message": "Officer performance is derived from available claim history attribution. Unattributed claims do not show user-specific performance.",
    }
