from typing import List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    def add(self, websocket: WebSocket):
        self.active_connections.append(websocket)
        print(len(self.active_connections), "active connections")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, event: str, data: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json({"event": event, "data": data})
            except Exception as e:
                print(f"Error sending message to {connection}: {e}")

connection_manager = ConnectionManager()