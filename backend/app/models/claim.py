from sqlalchemy import Column, String, Numeric, Date, Integer
from geoalchemy2 import Geometry

from app.core.base import Base


class Claim(Base):
    __tablename__ = "claims"

    claim_id = Column(String(20), primary_key=True)

    state = Column(String(100), nullable=False)
    district_id = Column(String(10), nullable=False)
    district = Column(String(100), nullable=False)
    mandal = Column(String(100), nullable=False)
    village = Column(String(100), nullable=False)

    claimant_name = Column(String(100), nullable=False)
    claim_type = Column(String(10), nullable=False)

    land_area_acres = Column(Numeric(10, 2), nullable=False)

    status = Column(String(20), nullable=False)

    submission_date = Column(Date, nullable=False)
    decision_date = Column(Date)

    processing_days = Column(Integer)
    pending_days = Column(Integer)
    claim_age_days = Column(Integer)

    location_id = Column(String(10))

    geom = Column(
        Geometry(
            geometry_type="POINT",
            srid=4326
        )
    )