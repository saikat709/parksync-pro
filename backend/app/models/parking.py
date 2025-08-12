from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.models.base import Base
from datetime import datetime

class Parking(Base):
    __tablename__ = "parking"

    id = Column(Integer, primary_key=True, index=True)
    
    parking_id = Column(
        Integer,
        unique=True,
        index=True,
        nullable=True
    )

    starting_time = Column(DateTime, default=datetime.now(), nullable=False)
    time = Column(DateTime, nullable=True)  # End time or duration
    zone_id = Column(String, ForeignKey("zones.zone_id"), nullable=False)
    slot = Column(Integer, nullable=False)
    fare = Column(Float, nullable=True, default=100)

    zone = relationship("Zone", back_populates="parking_records")
