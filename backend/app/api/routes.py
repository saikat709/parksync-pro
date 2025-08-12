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

from app.libs.connection_manager import connection_manager

router = APIRouter()

class LogCreateRequest(BaseModel):
    type: str
    zone: str
    slot: int

@router.get("/")
async def root():
    
    await connection_manager.broadcast( "test", {
        "message": "WebSocket event triggered from root endpoint"
    })
    print("\nRoot endpoint hit. Web Socket event triggered.")
    print(connection_manager.active_connections, "active connections\n")

    return { "message": "My FastAPI application is running!" }

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
    print(f"Retrieved logs for page: {logs[0]}")
    
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
        print(zone.boolean_list, "boolean list updated\n\n\n")
        
        new_log = Log(
            type="park",
            zone=zone_id,
            slot=slot,
        )

        session.add(new_log)
        await session.commit()
        await session.refresh(new_parking)
        await session.refresh(zone)

        print(f"\nparking-{zone.zone_id} has been broadcasted with slot {new_parking.slot} and status 1")
        await connection_manager.broadcast("parking-" + zone.zone_id, {
            "slot": new_parking.slot,
            "status": 1
        })
        
        return {
            # "message": "Parking started successfully",
            "parking_id": new_parking.parking_id,
            # "zone_id": zone_id,
            # "slot": slot,
            # "starting_time": new_parking.starting_time
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
                # Parking.time.is_(None)
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
    # ! or max(fare_rate, int(duration_minutes * (fare_rate / 60)))
    total_fare = fare_rate*duration_minutes/60 


    slot_index = active_parking.slot - 1
    zone.boolean_list[slot_index] = False
    print(zone.boolean_list, "boolean list updated\n\n\n")


    new_log = Log(
        type="moved",
        zone=active_parking.zone_id,
        slot=active_parking.slot
    )

    try:
        session.add(new_log)
        session.add(zone)
        await session.commit()
        await session.refresh(zone)
        await session.refresh(active_parking)
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
    print(f"\nparking-{zone.zone_id} has been broadcasted with slot {active_parking.slot} and status 0")
    await connection_manager.broadcast(f"parking-{zone.zone_id}", {
        "slot": active_parking.slot,
        "status": 0
    })

    return {
        # "zone_id": active_parking.zone_id,
        # "slot": active_parking.slot,
        # "duration_minutes": duration_minutes,
        "fare": total_fare
    }



@router.get("/parkings/")
async def get_parkings(session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Parking)
        .options(selectinload(Parking.zone))
        .order_by(Parking.starting_time.desc())
    )
    parkings = result.scalars().all()
    
    return {
        "parkings": [
            {
                "parking_id": p.parking_id,
                "zone_id": p.zone.zone_id,
                "slot": p.slot,
                "starting_time": p.starting_time,
                "ending_time": p.time
            } for p in parkings
        ]
    }


@router.get("/parking/{parking_id}")
async def get_parking(
    parking_id: int,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Parking)
        .options(selectinload(Parking.zone))
        .where(Parking.parking_id == parking_id)
    )
    parking = result.scalar_one_or_none()
    
    if not parking:
        raise HTTPException(status_code=404, detail="Parking not found")
    
    return {
        "parking_id": parking.parking_id,
        "zone_id": parking.zone.zone_id,
        "slot": parking.slot,
        "starting_time": parking.starting_time,
        "ending_time": parking.time,
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