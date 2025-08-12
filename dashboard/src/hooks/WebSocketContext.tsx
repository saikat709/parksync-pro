import {
  useEffect,
  useRef,
} from "react";
import { WebSocketContext } from "./useWebSocket";
import type { WSMessage, WebSocketProviderProps } from "../libs/HookTypes";


export const WebSocketProvider = ({
  url = "ws://localhost:8000/ws",
  children,
}: WebSocketProviderProps ) => {
  const ws = useRef<WebSocket | null>(null);
  const messageHandlers = useRef<Array<((msg: WSMessage) => void)>>([]);

  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        // console.log("WebSocket connected to server:", url);
      };

      ws.current.onmessage = (event: MessageEvent) => {
        // console.log("WebSocketContext onMessage:", event.data);
          try {
            const parsed: WSMessage = JSON.parse(event.data);
            messageHandlers.current.forEach(handler => {
              handler({ event: parsed.event, data: parsed.data });
            });
          } catch (e) {
            console.error("Invalid JSON:", e);
          }
      };

      ws.current.onerror = (error: Event) => {
        console.error("WebSocket error:", error);
      };

      ws.current.onclose = () => {
        // console.log("WebSocket disconnected");
      };
    }

    return () => {
      // Do NOT close to keep connection alive globally
      // Optionally close on unmount of provider if needed
    };
  }, [url]);

  const onMessage = (callback: ( {event, data } : WSMessage) => void) => {
    messageHandlers.current.push(callback);
  };

  const removeHandler = (callback: ( {event, data } : WSMessage) => void) => {
    messageHandlers.current = messageHandlers.current.filter(h => h !== callback);
  };

  const sendMessage = (msg: unknown) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    } else {
      console.warn("WebSocket not connected");
    }
  };

  return (
    <WebSocketContext.Provider value={{ onMessage, sendMessage, removeHandler }}>
      {children}
    </WebSocketContext.Provider>
  );
};

