from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.report import ReportGenerateRequest, ReportResponse
from app.services.report_service import generate_claim_report

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post("/generate", response_model=ReportResponse)
def generate_report(
    request: ReportGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        report = generate_claim_report(db, request.report_type, request.district, request.claim_type)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Report generation failed: {str(exc)}") from exc

    return ReportResponse(**report)


@router.get("/claims-summary")
def claims_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return generate_claim_report(db, "overall")
