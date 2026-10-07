from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey

from app.core.base import Base


class ClaimHistory(Base):
    __tablename__ = "claim_history"

    id = Column(Integer, primary_key=True, index=True)

    claim_id = Column(
        String(20),
        ForeignKey("claims.claim_id"),
        nullable=False,
        index=True
    )

    previous_status = Column(String(20), nullable=True)

    new_status = Column(String(20), nullable=False)

    changed_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    changed_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    remarks = Column(Text, nullable=True)