from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.models.item import Item
from app.models.log import Log
from app.models.zone import Zone
from app.db.session import get_session
from pydantic import BaseModel
from datetime import datetime

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
        raise HTTPException(status_code=404, detail="Zone not found")
    
    return {
        "id": zone.id,
        "zone_id": zone.zone_id,
        "name": zone.name,
        "total_slots": zone.total_slots,
        "boolean_list": zone.boolean_list,
        "occupancy_rate": round((zone.total_slots - zone.available_slots) / zone.total_slots * 100, 2) if zone.total_slots > 0 else 0
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
            "boolean_list": zone.boolean_list
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
            "boolean_list": zone.boolean_list
        } for zone in zones
    ]
