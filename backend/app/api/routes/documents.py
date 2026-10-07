import os
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.core.database import get_db
from app.models.claim import Claim
from app.models.document import Document
from app.models.user import User
from app.schemas.document import ClaimDocumentCreate, ClaimDocumentResponse
from app.services.document_service import (
    UPLOAD_ROOT,
    create_claim_document,
    delete_claim_document,
    document_storage_path,
    get_claim_documents,
    normalize_document_type,
)

router = APIRouter(tags=["Documents"])


@router.post("/claims/{claim_id}/documents", response_model=ClaimDocumentResponse, status_code=status.HTTP_201_CREATED)
def upload_claim_document(
    claim_id: str,
    description: str | None = None,
    document_type: str = "supporting_document",
    remarks: str | None = None,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    claim = db.query(Claim).filter(Claim.claim_id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Claim '{claim_id}' not found")

    if file.filename is None or not file.filename.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Document filename is required")

    if file.content_type and file.content_type.startswith("application/x-msdownload"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This file type is not allowed")

    raw_bytes = file.file.read() if hasattr(file.file, "read") else b""
    if len(raw_bytes) > 8 * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Document size exceeds 8MB limit")

    safe_name = os.path.basename(file.filename)
    if safe_name != file.filename or "/" in file.filename or "\\" in file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file name")

    storage_path = document_storage_path(claim_id, safe_name)
    with open(storage_path, "wb") as handle:
        handle.write(raw_bytes)

    doc = create_claim_document(
        db=db,
        claim_id=claim_id,
        filename=storage_path.name,
        original_filename=safe_name,
        document_type=document_type or "supporting_document",
        description=description,
        storage_path=str(storage_path),
        uploaded_by=current_user.id,
        file_size=len(raw_bytes),
        mime_type=file.content_type or "application/octet-stream",
        remarks=remarks,
    )
    return {
        "id": doc.id,
        "claim_id": doc.claim_id,
        "filename": doc.filename,
        "original_filename": doc.original_filename,
        "document_type": doc.document_type,
        "description": doc.description,
        "storage_path": doc.storage_path,
        "uploaded_by": doc.uploaded_by,
        "uploaded_by_username": current_user.username,
        "uploaded_at": doc.uploaded_at,
        "file_size": doc.file_size,
        "mime_type": doc.mime_type,
        "verification_status": doc.verification_status,
        "remarks": doc.remarks,
    }


@router.get("/claims/{claim_id}/documents")
def list_claim_documents(
    claim_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    claim = db.query(Claim).filter(Claim.claim_id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Claim '{claim_id}' not found")

    documents = get_claim_documents(db, claim_id)
    return [
        {
            "id": item.id,
            "claim_id": item.claim_id,
            "filename": item.filename,
            "original_filename": item.original_filename,
            "document_type": item.document_type,
            "description": item.description,
            "storage_path": item.storage_path,
            "uploaded_by": item.uploaded_by,
            "uploaded_by_username": item.uploader.username if item.uploader else None,
            "uploaded_at": item.uploaded_at,
            "file_size": item.file_size,
            "mime_type": item.mime_type,
            "verification_status": item.verification_status,
            "remarks": item.remarks,
        }
        for item in documents
    ]


@router.get("/documents/{document_id}")
def get_document_metadata(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return {
        "id": document.id,
        "claim_id": document.claim_id,
        "filename": document.filename,
        "original_filename": document.original_filename,
        "document_type": document.document_type,
        "description": document.description,
        "storage_path": document.storage_path,
        "uploaded_by": document.uploaded_by,
        "uploaded_by_username": document.uploader.username if document.uploader else None,
        "uploaded_at": document.uploaded_at,
        "file_size": document.file_size,
        "mime_type": document.mime_type,
        "verification_status": document.verification_status,
        "remarks": document.remarks,
    }


@router.get("/documents/{document_id}/download")
def download_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    file_path = Path(document.storage_path)
    if not file_path.exists() or not str(file_path).startswith(str(UPLOAD_ROOT)):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document file not available")

    return FileResponse(path=str(file_path), filename=document.original_filename, media_type=document.mime_type or "application/octet-stream")


@router.delete("/documents/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    if current_user.role not in {"admin", "officer"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only officers/admins can delete documents")

    delete_claim_document(db, document)
    return {"message": "Document deleted successfully"}
