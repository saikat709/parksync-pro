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

interface ParkingInfoType {
  zone_id?: string;
  slot: number;
  start_time: string;
  zone: string,
  fare_rate?: number;
}


interface AuthContextType {
  login: (parkingId: number) => void;
  logout?: () => void;
  onError?: (callback: (msg: string) => void) => void;
  isLoggedIn?: boolean;
  isLoading?: boolean;
  parking: ParkingInfoType | null;
}


export type { 
  WSMessage, 
  WebSocketContextType, 
  WebSocketProviderProps, 
  SocketTestData, 
  SocketParkingStatus,
  AuthContextType,
  ParkingInfoType
};