from sqlalchemy import Column, Integer, String, DateTime
from app.models.base import Base
from datetime import datetime

class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False, index=True)
    date = Column(DateTime, default=datetime.now(), nullable=False)
    time = Column(DateTime, default=datetime.now(), nullable=False)
    zone = Column(String, nullable=False, index=True)
    slot = Column(String, nullable=False, index=True)


    def __str__(self):
        return f"Log[{self.type}, {self.date}, {self.time}, {self.zone}, {self.slot}]"
    