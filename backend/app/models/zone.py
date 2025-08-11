from sqlalchemy import Column, Integer, String, JSON
from sqlalchemy.orm import relationship
from app.models.base import Base
from sqlalchemy.ext.mutable import MutableList

class Zone(Base):
    __tablename__ = "zones"

    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(String, unique=True, nullable=False)
    name = Column(String, index=True)
    total_slots = Column(Integer, default=0, nullable=False)
    boolean_list = Column(MutableList.as_mutable(JSON), nullable=False)
    fare = Column(Integer, default=10, nullable=False)
    
    parking_records = relationship("Parking", back_populates="zone")
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if self.boolean_list is None and self.total_slots is not None:
            self.boolean_list = [False] * self.total_slots