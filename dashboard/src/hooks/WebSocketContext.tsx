import {
  useEffect,
  useRef,
} from "react";
import { WebSocketContext } from "./useWebSocket";
import type { WSMessage, WebSocketProviderProps } from "../libs/HookTypes";


export const WebSocketProvider = ({
  url = "ws://your-fastapi-server-ip:8000/ws",
  children,
}: WebSocketProviderProps) => {
  const ws = useRef<WebSocket | null>(null);
  const messageHandler = useRef<((msg: WSMessage) => void) | null>(null);

  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.current.onmessage = (event: MessageEvent) => {
        if (messageHandler.current) {
          try {
            const parsed: WSMessage = JSON.parse(event.data);
            messageHandler.current(parsed);
          } catch (e) {
            console.error("Invalid JSON:", e);
          }
        }
      };

      ws.current.onerror = (error: Event) => {
        console.error("WebSocket error:", error);
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected");
      };
    }

    return () => {
      // Do NOT close to keep connection alive globally
      // Optionally close on unmount of provider if needed
    };
  }, [url]);

  const onMessage = (callback: (msg: WSMessage) => void) => {
    messageHandler.current = callback;
  };

  const sendMessage = (msg: unknown) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    } else {
      console.warn("WebSocket not connected");
    }
  };

  return (
    <WebSocketContext.Provider value={{ onMessage, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

