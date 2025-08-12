from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, and_
from sqlalchemy.orm import selectinload
from app.models.parking import Parking
from app.models.zone import Zone
from app.models.log import Log
from app.db.session import get_session
from pydantic import BaseModel
from datetime import datetime
from app.libs.connection_manager import connection_manager

router = APIRouter()

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
    total_fare = fare_rate*duration_minutes

    active_parking.fare = total_fare

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
        session.add(active_parking)
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
        "zone_name": parking.zone.name,
        "starting_time": parking.starting_time,
        "ending_time": parking.time,
        "fare": parking.fare if parking.fare else 0,
        "fare_rate": parking.zone.fare if parking.zone.fare else 100
    }