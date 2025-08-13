from typing import List
from fastapi import WebSocket

class ConnectionManager:
    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ConnectionManager, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        # Only initialize once to prevent re-initialization on subsequent calls
        if not ConnectionManager._initialized:
            self.active_connections: List[WebSocket] = []
            ConnectionManager._initialized = True

    def add(self, websocket: WebSocket):
        self.active_connections.append(websocket)
        print(len(self.active_connections), "active connections")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    def remove(self, websocket: WebSocket ):
        self.active_connections.remove(websocket)

    async def broadcast(self, event: str, data: dict):
        cnt = 0
        for connection in self.active_connections:
            try:
                await connection.send_json({"event": event, "data": data})
                cnt += 1
            except Exception as e:
                print(f"Error sending message to {connection}: {e}")
        print(f"\n\nBroadcasted to {cnt} connections for event: {event}")

    @classmethod
    def get_instance(cls):
        """Get the singleton instance of ConnectionManager"""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance


# Create the singleton instance
connection_manager = ConnectionManager()