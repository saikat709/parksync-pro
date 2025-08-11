from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.models.log import Log
from app.models.zone import Zone
from app.models.parking import Parking
from app.db.session import get_session
from pydantic import BaseModel

router = APIRouter()

class ZoneCreateRequest(BaseModel):
    zone_id: str
    total_slots: int 
    fare: int
    name: str


@router.get("/zone/{zone_id}")
async def get_zone(
    zone_id: str,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Zone).where(Zone.zone_id == zone_id)
    )
    zone = result.scalar_one_or_none()
    
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found. Maybe not created yet?")
    
    available_slots = sum(1 for slot in zone.boolean_list if not slot)
    
    return {
        "id": zone.id,
        "zone_id": zone.zone_id,
        "name": zone.name,
        "total_slots": zone.total_slots,
        "slots": zone.boolean_list,
        "fare": zone.fare,
        "occupancy_rate": round((zone.total_slots - available_slots) / zone.total_slots * 100, 2) if zone.total_slots > 0 else 0
    }

@router.post("/zone/")
async def create_zone(
    create_request: ZoneCreateRequest,
    session: AsyncSession = Depends(get_session)
):
    zone = Zone(
        zone_id=create_request.zone_id,
        name=create_request.name,
        total_slots=create_request.total_slots,
        fare=create_request.fare,
        boolean_list=[False] * create_request.total_slots
    )

    session.add(zone)
    await session.commit()
    await session.refresh(zone)
    
    return {
        "message": f"Zone {create_request.zone_id} created successfully",
        "zone": {
            "id": zone.id,
            "zone_id": zone.zone_id,
            "name": zone.name,
            "total_slots": zone.total_slots,
            "boolean_list": zone.boolean_list,
            "fare": zone.fare
        }
    }


@router.get("/zones/")
async def list_zones(
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(select(Zone))
    zones = result.scalars().all()
    
    return [
        {
            "id": zone.id,
            "zone_id": zone.zone_id,
            "name": zone.name,
            "total_slots": zone.total_slots,
            "boolean_list": zone.boolean_list,
            "fare": zone.fare
        } for zone in zones
    ]


@router.put("/bar-data/")
def get_bar_chart_data(
    session: AsyncSession = Depends(get_session)
):
    result = session.execute(
        select(
            Zone.zone_id,
            func.count(Parking.id).label("count")
        )
        .join(Parking, Parking.zone_id == Zone.zone_id)
        .group_by(Zone.zone_id)
    )
    
    data = result.all()
    
    return {
        "labels": [row[0] for row in data],
        "data": [row[1] for row in data]
    }