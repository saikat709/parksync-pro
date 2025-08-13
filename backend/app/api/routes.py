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
from datetime import datetime, timedelta
import math

from app.libs.connection_manager import ConnectionManager

connection_manager = ConnectionManager.get_instance()

router = APIRouter()

class LogCreateRequest(BaseModel):
    log_type: str
    zone_id: str
    # slot: int

@router.get("/")
async def root():
    
    await connection_manager.broadcast( "test", {
        "message": "WebSocket event triggered from root endpoint"
    })
    print("\nRoot endpoint hit. Web Socket event triggered.")
    print(connection_manager.active_connections, "active connections\n")

    return { 
        "message": "Welcome to the ParksSync API!",
        "active_connections": len(connection_manager.active_connections)
     }

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
        type=log_request.log_type,
        zone=log_request.zone_id,
        slot=0,  # Assuming slot is not used in this context
    )
    session.add(new_log)
    await session.commit()
    await session.refresh(new_log)
    print(f"Log created: {new_log}")

    await connection_manager.broadcast("log-" + log_request.zone_id, {
        "type": new_log.type,
        "zone": new_log.zone,
        "slot": new_log.slot,
        "id": new_log.id,
        "date": new_log.date.isoformat() if new_log.date else None,
        "time": new_log.time.isoformat() if new_log.time else None,
    })
    print("\nRoot endpoint hit. Web Socket event triggered.")
    print(connection_manager.active_connections, "active connections\n")

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


@router.get("/analysis")
async def get_analysis(session: AsyncSession = Depends(get_session)):
    zones_result = await session.execute(select(Zone))
    zones = zones_result.scalars().all()
    
    total_slots = 0
    occupied_slots = 0
    
    for zone in zones:
        total_slots += zone.total_slots
        if zone.boolean_list:
            occupied_slots += sum(zone.boolean_list)
    
    available_slots = total_slots - occupied_slots
    
    from datetime import datetime, timedelta
    
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=6)  
    
    logs_result = await session.execute(
        select(Log)
        .where(
            and_(
                Log.type == "park",
                func.date(Log.date) >= start_date,
                func.date(Log.date) <= end_date
            )
        )
        .order_by(Log.date.desc())
    )
    logs = logs_result.scalars().all()
    
    car_data_dict = {}
    
    for i in range(7):
        date = start_date + timedelta(days=i)
        date_str = date.strftime("%d/%m")
        car_data_dict[date_str] = 0
    
    for log in logs:
        log_date = log.date.date()
        date_str = log_date.strftime("%d/%m")
        if date_str in car_data_dict:
            car_data_dict[date_str] += 1
    
    car_data = [
        { "date": date_str, "cars": count}
        for date_str, count in car_data_dict.items()
    ]
    
    car_data.sort(key=lambda x: datetime.strptime(x["date"], "%d/%m"))

    return {
        "pieData": {
            "availableSlots": available_slots,
            "totalSlots": total_slots
        },
        "barData": car_data
    }


@router.get("/overall")
async def get_overall(session: AsyncSession = Depends(get_session)):
    zones_result = await session.execute(select(Zone))
    zones = zones_result.scalars().all()
    
    total_slots = 0
    available_slots = 0
    zone_data = {}
    
    for zone in zones:
        zone_total = zone.total_slots
        total_slots += zone_total
        zone_occupied = sum(zone.boolean_list) if zone.boolean_list else 0
        zone_available = zone_total - zone_occupied
        
        available_slots += zone_available
        
        zone_data["zone_" + zone.zone_id] = {
            "total_slots": zone_total,
            "available_slots": zone_available,
        }
    
    total_fare = sum(zone.fare for zone in zones)
    average_fare = total_fare / len(zones) if zones else 0
    
    completed_parkings_result = await session.execute(
        select(Parking).where(Parking.time.is_not(None))
    )
    completed_parkings = completed_parkings_result.scalars().all()
    
    if completed_parkings:
        total_duration_minutes = sum(
            (parking.time - parking.starting_time).total_seconds() / 60
            for parking in completed_parkings
        )
        average_time = total_duration_minutes / len(completed_parkings)
    else:
        average_time = 0
    
    response_data = {
        "total_slots": total_slots,
        "available_slots": available_slots,
        "average_fare": round(average_fare, 2),
        "average_time": round(average_time, 2),
    }
    
    response_data.update(zone_data)
    
    return response_data