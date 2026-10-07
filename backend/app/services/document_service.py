from __future__ import annotations

import os
import re
from datetime import datetime
from pathlib import Path

from sqlalchemy.orm import Session

from app.models.claim import Claim
from app.models.document import Document

UPLOAD_ROOT = Path(__file__).resolve().parents[1] / "uploads"
UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)

ALLOWED_DOCUMENT_TYPES = {
    "identity",
    "proof_of_residence",
    "land_record",
    "survey_map",
    "supporting_document",
    "other",
}


def normalize_document_type(value: str | None) -> str:
    if not value:
        return "other"
    normalized = value.strip().lower().replace(" ", "_")
    return normalized if normalized in ALLOWED_DOCUMENT_TYPES else "other"


def safe_storage_name(filename: str, claim_id: str) -> str:
    safe = os.path.basename(filename or "document")
    safe = re.sub(r"[^A-Za-z0-9_.-]+", "_", safe)
    safe = safe.strip("._") or "document"
    stamp = int(datetime.utcnow().timestamp() * 1000)
    return f"{claim_id}_{stamp}_{safe}"


def document_storage_path(claim_id: str, filename: str) -> Path:
    claim_dir = UPLOAD_ROOT / claim_id
    claim_dir.mkdir(parents=True, exist_ok=True)
    return claim_dir / safe_storage_name(filename, claim_id)


def get_claim_documents(db: Session, claim_id: str) -> list[Document]:
    return db.query(Document).filter(Document.claim_id == claim_id).order_by(Document.uploaded_at.desc()).all()


def create_claim_document(
    db: Session,
    claim_id: str,
    filename: str,
    original_filename: str,
    document_type: str,
    description: str | None,
    storage_path: str,
    uploaded_by: int,
    file_size: int | None,
    mime_type: str | None,
    remarks: str | None = None,
) -> Document:
    claim = db.query(Claim).filter(Claim.claim_id == claim_id).first()
    if not claim:
        raise ValueError(f"Claim '{claim_id}' not found")

    doc = Document(
        claim_id=claim_id,
        filename=filename,
        original_filename=original_filename,
        document_type=normalize_document_type(document_type),
        description=description,
        storage_path=storage_path,
        uploaded_by=uploaded_by,
        file_size=file_size,
        mime_type=mime_type,
        verification_status="uploaded",
        remarks=remarks,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


def delete_claim_document(db: Session, doc: Document) -> None:
    storage_file = Path(doc.storage_path)
    if storage_file.exists():
        try:
            storage_file.unlink()
        except OSError:
            pass
    db.delete(doc)
    db.commit()
