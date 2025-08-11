import type { WebSocketContextType } from "../libs/HookTypes";
import { createContext, useContext } from "react";

export const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
};

export default useWebSocket;
