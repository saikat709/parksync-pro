from fastapi import FastAPI
from app.api import routes, zone_routes
from app.models.item import Base
from app.db.session import engine
from fastapi.middleware.cors import CORSMiddleware
from app.libs.socket import socket_route    

app = FastAPI(
    title="ParkSync.Pro Backend",
    description="Backend API for ParkSync.Pro, a parking management system.",
    version="1.0.0",
)

origins = [
    "http://localhost:3000",  # React dev server default
    "http://127.0.0.1:3000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],    # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],    # allow all headers
)

app.include_router(routes.router)
app.include_router(zone_routes.router)
app.include_router(socket_route)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        print("\nDatabase tables created successfully.")
        print("API Server is      : http://127.0.0.1:8000")
        print("WebSocket Server is: ws://127.0.1:8000/ws")
        print("You can access the API documentation at: http://127.0.1:8000/docs")
        print("Use inconfig to get your IP address to access from other device.\n")
