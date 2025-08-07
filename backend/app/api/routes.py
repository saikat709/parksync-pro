from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.item import Item
from app.db.session import get_session

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "My FastAPI application is running!"}

@router.get("/esp32-test")
def esp32_test():
    print("Yay!!! ESP32 test endpoint hit.")
    return {"message": "ESP32 EndPoint Working!"}


@router.post("/items/")
async def create_item(name: str, description: str | None = None, session: AsyncSession = Depends(get_session)):
    new_item = Item(name=name, description=description)
    session.add(new_item)
    await session.commit()
    await session.refresh(new_item)
    return new_item


@router.get("/items/{item_id}")
async def read_item(item_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Item).where(Item.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
