from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.core.database import get_db
from app.models.claim import Claim
from app.models.user import User
from app.schemas.assistant import AssistantQueryRequest, AssistantQueryResponse
from app.services.assistant_service import process_assistant_query

router = APIRouter(prefix="/assistant", tags=["Assistant"])


@router.post("/query", response_model=AssistantQueryResponse)
def assistant_query(
    request: AssistantQueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Query is required")

    try:
        result = process_assistant_query(db, request.query.strip())
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Assistant query failed: {str(exc)}") from exc

    return AssistantQueryResponse(
        answer=result["answer"],
        intent=result.get("intent"),
        data=result.get("data"),
        results=result.get("results"),
        query_interpretation=result.get("query_interpretation"),
    )


@router.post("/voice")
def assistant_voice(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    text_input = payload.get("text") or payload.get("query") or payload.get("transcript")
    if not text_input or not str(text_input).strip():
        return {
            "ok": False,
            "message": "No speech transcript was provided. Please type or speak a query.",
        }

    return process_assistant_query(db, str(text_input).strip())
