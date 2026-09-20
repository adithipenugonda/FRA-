from sqlalchemy import Column, String
from geoalchemy2 import Geometry

from app.core.base import Base


class Location(Base):
    __tablename__ = "locations"

    location_id = Column(String(10), primary_key=True)

    district_id = Column(String(10), nullable=False)
    district = Column(String(100), nullable=False)
    mandal = Column(String(100), nullable=False)
    village = Column(String(100), nullable=False)

    geom = Column(
        Geometry(
            geometry_type="POINT",
            srid=4326
        )
    )