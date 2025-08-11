from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Sequence
from sqlalchemy.orm import relationship
from app.models.base import Base
from datetime import datetime

class Parking(Base):
    __tablename__ = "parking"

    id = Column(Integer, primary_key=True, index=True)
    parking_id = Column(
        Integer, 
        Sequence('parking_id_seq', start=1001, increment=1),
        unique=True,
        nullable=False,
        index=True
    )
    
    starting_time = Column(DateTime, default=datetime.now(), nullable=False)
    time = Column(DateTime, nullable=True)  # End time or duration
    zone_id = Column(String, ForeignKey("zones.zone_id"), nullable=False)
    slot = Column(String, nullable=False)

    zone = relationship("Zone", back_populates="parking_records")
