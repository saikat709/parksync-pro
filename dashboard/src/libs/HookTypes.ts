import type { ReactNode } from "react";

interface WSMessage {
  event: string;
  data: unknown;
};

interface WebSocketContextType {
  onMessage: (callback: (msg: WSMessage) => void) => void;
  sendMessage: (msg: unknown) => void;
  removeHandler: (callback: (msg: WSMessage) => void) => void;
};

interface WebSocketProviderProps {
  url?: string;
  children: ReactNode;
};

interface SocketTestData {
  message: string;
}

interface SocketParkingStatus {
  slot: number;
  status: boolean;
}

export type { 
  WSMessage, 
  WebSocketContextType, 
  WebSocketProviderProps, 
  SocketTestData, 
  SocketParkingStatus 
};