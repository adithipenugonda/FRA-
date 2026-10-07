from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.base import Base


class Document(Base):
    __tablename__ = "claim_documents"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(String(20), ForeignKey("claims.claim_id"), nullable=False, index=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    document_type = Column(String(50), nullable=False, default="other")
    description = Column(Text, nullable=True)
    storage_path = Column(String(500), nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    file_size = Column(Integer, nullable=True)
    mime_type = Column(String(100), nullable=True)
    verification_status = Column(String(30), nullable=True, default="uploaded")
    remarks = Column(Text, nullable=True)

    claim = relationship("Claim", lazy="joined")
    uploader = relationship("User", lazy="joined")
