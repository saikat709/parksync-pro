import asyncio
import websockets

async def test_ws():
    uri = "ws://127.0.0.1:8000/ws"
    async with websockets.connect(uri) as websocket:
        print("Connected to FastAPI WebSocket!")
        await websocket.send("Hello from Python client!")
        response = await websocket.recv()
        print("Received:", response)

asyncio.run(test_ws())
