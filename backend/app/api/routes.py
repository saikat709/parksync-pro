from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.models.item import Item
from app.models.log import Log, LogType
from app.db.session import get_session
from typing import Optional
import math

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "My FastAPI application is running!"}

@router.get("/esp32-test")
def esp32_test():
    print("Yay!!! ESP32 test endpoint hit.")
    return {"message": "ESP32 EndPoint Working!"}


@router.post("/log/")
async def create_log(
    type: LogType, 
    zone: str, 
    slot: str, 
    message: str = None, 
    session: AsyncSession = Depends(get_session)
):
    new_log = Log(
        type=type,
        zone=zone,
        slot=slot,
        message=message
    )
    session.add(new_log)
    await session.commit()
    await session.refresh(new_log)
    print(f"Log created: {new_log}")
    return new_log


@router.get("/log/")
async def get_logs(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Number of items per page"),
    session: AsyncSession = Depends(get_session)
):
    offset = (page - 1) * page_size
    
    count_result = await session.execute(select(func.count(Log.id)))
    total_count = count_result.scalar()
    
    total_pages = math.ceil(total_count / page_size) if total_count > 0 else 1
    
    result = await session.execute(
        select(Log)
        .order_by(Log.date.desc())
        .offset(offset)
        .limit(page_size)
    )
    logs = result.scalars().all()
    
    has_previous = page > 1
    has_next = page < total_pages
    
    return {
        "logs": logs,
        "has_next": has_next,
        "has_previous": has_previous,
        "total_pages": total_pages,
        "current_page": page
    }
