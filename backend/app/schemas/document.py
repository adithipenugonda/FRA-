from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ClaimDocumentCreate(BaseModel):
    document_type: str = "supporting_document"
    description: str | None = None
    remarks: str | None = None


class ClaimDocumentResponse(BaseModel):
    id: int
    claim_id: str
    filename: str
    original_filename: str
    document_type: str
    description: str | None = None
    storage_path: str
    uploaded_by: int
    uploaded_by_username: str | None = None
    uploaded_at: datetime
    file_size: int | None = None
    mime_type: str | None = None
    verification_status: str | None = None
    remarks: str | None = None

    model_config = ConfigDict(from_attributes=True)
