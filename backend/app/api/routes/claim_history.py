from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.claim import Claim
from app.models.claim_history import ClaimHistory
from app.models.user import User
from app.api.routes.auth import get_current_user


router = APIRouter(
    prefix="/claims",
    tags=["Claim History"]
)

VALID_STATUS_VALUES = {"pending", "approved", "rejected", "in_review", "field_verification"}


class ClaimHistoryCreate(BaseModel):
    new_status: str
    remarks: str | None = None


def _normalize_status(status_value: str | None) -> str | None:
    if status_value is None:
        return None
    normalized = status_value.strip()
    if not normalized:
        return None
    return normalized


@router.get("/{claim_id}/history")
def get_claim_history(
    claim_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    claim = db.query(Claim).filter(
        Claim.claim_id == claim_id
    ).first()

    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Claim '{claim_id}' not found"
        )

    history = (
        db.query(ClaimHistory)
        .filter(ClaimHistory.claim_id == claim_id)
        .order_by(ClaimHistory.changed_at.asc())
        .all()
    )

    return [
        {
            "id": item.id,
            "claim_id": item.claim_id,
            "previous_status": item.previous_status,
            "new_status": item.new_status,
            "changed_by": item.changed_by,
            "changed_at": item.changed_at,
            "remarks": item.remarks,
        }
        for item in history
    ]


@router.post("/{claim_id}/history", status_code=status.HTTP_201_CREATED)
def add_claim_history(
    claim_id: str,
    request: ClaimHistoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    claim = db.query(Claim).filter(
        Claim.claim_id == claim_id
    ).first()

    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Claim '{claim_id}' not found"
        )

    new_status = _normalize_status(request.new_status)
    if not new_status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New status is required"
        )

    status_key = new_status.lower()
    if status_key not in VALID_STATUS_VALUES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status. Allowed values: pending, approved, rejected, in_review, field_verification"
        )

    previous_status = claim.status
    if previous_status is not None and previous_status.lower() == status_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Claim already has this status"
        )

    history = ClaimHistory(
        claim_id=claim.claim_id,
        previous_status=previous_status,
        new_status=new_status,
        changed_by=current_user.id,
        changed_at=datetime.utcnow(),
        remarks=request.remarks,
    )

    claim.status = new_status

    db.add(history)
    db.commit()
    db.refresh(history)
    db.refresh(claim)

    return {
        "message": "Claim status updated successfully",
        "history": {
            "id": history.id,
            "claim_id": history.claim_id,
            "previous_status": history.previous_status,
            "new_status": history.new_status,
            "changed_by": history.changed_by,
            "changed_at": history.changed_at,
            "remarks": history.remarks,
        }
    }