from fastapi import FastAPI
from app.api import routes
from app.models.item import Base
from app.db.session import engine

app = FastAPI()

app.include_router(routes.router)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
