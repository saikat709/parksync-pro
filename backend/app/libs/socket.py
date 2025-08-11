from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from app.libs.connection_manager import connection_manager
import json
from fastapi import APIRouter

socket_route = APIRouter()

@socket_route.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connection_manager.add(websocket)
    print("\n\nWebSocket connection established\n\n")
    try:
        while True:
            await websocket.receive_text()
            # No need incoming data
    except WebSocketDisconnect:
        connection_manager.remove(websocket)
