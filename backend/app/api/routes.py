from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, and_
from sqlalchemy.orm import selectinload
from app.models.item import Item
from app.models.log import Log
from app.models.parking import Parking
from app.models.zone import Zone
from app.db.session import get_session
from pydantic import BaseModel
from datetime import datetime
import math

from app.libs.connection_manager import connection_manager

router = APIRouter()

class LogCreateRequest(BaseModel):
    type: str
    zone: str
    slot: int


@router.get("/")
async def root():
    
    connection_manager.broadcast({"message": "Welcome to the Parking Sync API!"})
    print("Root endpoint hit. Web Socket event triggered.")

    return {"message": "My FastAPI application is running!"}

# @router.get("/esp32-test")
# def esp32_test():
#     print("Yay!!! ESP32 test endpoint hit.")
#     return {"message": "ESP32 EndPoint Working!"}


@router.post("/log/")
async def create_log(
    log_request: LogCreateRequest,
    session: AsyncSession = Depends(get_session)
):
    new_log = Log(
        type=log_request.type,
        zone=log_request.zone,
        slot=log_request.slot,
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


@router.post("/parking/start/")
async def start_parking(
    zone_id: str,
    slot: int,
    session: AsyncSession = Depends(get_session)
):
    try:
        zone_result = await session.execute(
            select(Zone).where(Zone.zone_id == zone_id)
        )
        zone = zone_result.scalar_one_or_none()
        
        if not zone:
            raise HTTPException(status_code=404, detail="Zone not found")
        
        try:
            slot_index = int(slot) - 1  # Assuming slots are 1-indexed
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid slot number")
        
        if slot_index < 0 or slot_index >= len(zone.boolean_list):
            raise HTTPException(status_code=400, detail="Slot number out of range")
        
        if zone.boolean_list[slot_index]:
            raise HTTPException(status_code=400, detail="Slot is already occupied")
        
        max_parking_id_result = await session.execute(
            select(func.max(Parking.parking_id))
        )
        max_parking_id = max_parking_id_result.scalar()
        next_parking_id = max(10001, (max_parking_id or 0) + 1)
        
        new_parking = Parking(
            parking_id=next_parking_id,
            zone_id=zone_id,
            slot=slot,
            starting_time=datetime.now()
        )
        session.add(new_parking)
        await session.flush() 

        bl = zone.boolean_list.copy()
        bl[slot_index] = True
        zone.boolean_list = bl
        
        new_log = Log(
            type="park",
            zone=zone_id,
            slot=slot,
        )

        session.add(new_log)
        await session.commit()
        await session.refresh(new_parking)
        await session.refresh(zone)
        
        return {
            "message": "Parking started successfully",
            "parking_id": new_parking.parking_id,
            "zone_id": zone_id,
            "slot": slot,
            "starting_time": new_parking.starting_time
        }
        
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    

@router.post("/parking/end/")
async def end_parking(
    parking_id: int,
    session: AsyncSession = Depends(get_session)
):

    active_parking_result = await session.execute(
        select(Parking)
        .options(selectinload(Parking.zone))
        .where(
            and_(
                Parking.parking_id == parking_id,
                Parking.time.is_(None)
            )
        )
    )
    active_parkings = active_parking_result.scalars().all()
    if not active_parkings:
        raise HTTPException(status_code=404, detail="No active parking session found for this slot")
    active_parking = active_parkings[0] 
    
    if not active_parking:
        raise HTTPException(status_code=404, detail="No active parking session found for this slot")
    zone = active_parking.zone

    end_time = datetime.now()
    active_parking.time = end_time
    duration_minutes = int((end_time - active_parking.starting_time).total_seconds() / 60)
    fare_rate = getattr(zone, "fare", 10) or 10
    total_fare = fare_rate*duration_minutes/60 # max(fare_rate, int(duration_minutes * (fare_rate / 60)))

    # Update the slot status (slots are 1-indexed, so subtract 1 for array access)
    slot_index = active_parking.slot - 1
    if 0 <= slot_index < len(zone.boolean_list):
        zone.boolean_list[slot_index] = False

    new_log = Log(
        type="moved",
        zone=active_parking.zone_id,  # Use zone_id instead of zone.name
        slot=active_parking.slot
    )
    session.add(new_log)

    try:
        await session.commit()
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    return {
        "zone_id": active_parking.zone_id,
        "slot": active_parking.slot,
        "duration_minutes": duration_minutes,
        "fare": total_fare
    }