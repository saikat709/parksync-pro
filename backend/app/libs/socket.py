from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from app.libs.connection_manager import connection_manager

from app.main import app

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await connection_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # To Handle incoming messages
    except WebSocketDisconnect:
        connection_manager.disconnect(websocket)