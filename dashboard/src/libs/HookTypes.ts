import type { ReactNode } from "react";

interface WSMessage {
  type: string;
  data: unknown;
};

interface WebSocketContextType {
  onMessage: (callback: (msg: WSMessage) => void) => void;
  sendMessage: (msg: unknown) => void;
};

interface WebSocketProviderProps {
  url?: string;
  children: ReactNode;
};

export type { WSMessage, WebSocketContextType, WebSocketProviderProps };