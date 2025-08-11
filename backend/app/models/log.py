from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import enum

Base = declarative_base()

class LogType(enum.Enum):
    ENTER = "enter"
    EXIT = "exit"
    PARKED = "parked"
    REMOVED = "removed"

class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(LogType), nullable=False, index=True)
    date = Column(DateTime, default=datetime.now(), nullable=False)
    time = Column(DateTime, default=datetime.now(), nullable=False)
    message = Column(String, nullable=True)
    zone = Column(String, nullable=False, index=True)
    slot = Column(String, nullable=False, index=True)