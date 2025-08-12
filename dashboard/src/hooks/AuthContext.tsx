import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AuthContext } from "./useAuth";
import axios from "axios";
import type { ParkingInfoType } from "../libs/HookTypes";


const apiUrl = import.meta.env.VITE_API_URL;

export const AuthContextProvider = ({
  children,
}: { children: ReactNode }) => {

    const [parking, setParking] = useState<ParkingInfoType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errorCallback, setErrorCallback] = useState<((msg: string) => void) | null>(null);

    useEffect(() => {
        const fetchParkingInfo = async () => {
          const localParkingInfo = localStorage.getItem("parkingInfo");
          if (localParkingInfo) {
            const parkingData = await JSON.parse(localParkingInfo);
            const parkingParsed: ParkingInfoType = parkingData.parkingData as ParkingInfoType;
            setParking(parkingParsed);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        };
        fetchParkingInfo();
    }, []);

    const login = async ( parkingId: number ) => {
        setIsLoading(true);
        console.log(`Logging in with parking ID: ${parkingId}`);
        try {
          const res = await axios.get(`${apiUrl}/parking/${parkingId}`);

          if ( res.status === 200 ) {
            const parkingData = res.data as ParkingInfoType;
            setParking(parkingData);
            console.log("Login successful, parking data:", parkingData);
            localStorage.setItem("parkingInfo", JSON.stringify({
              "parkingData": parkingData
            }));
            setIsLoggedIn(true);
          } else {
            throw new Error("Login failed");
          }

        } catch (error) {
          console.error("Error during login:", error);
          if ( errorCallback ) errorCallback((error as Error).message);
        } finally {
          setIsLoading(false);
        }
    };

    const onError = (callback: (msg: string) => void) => {
        setErrorCallback(() => callback);
    };

    const logout = () => {
        setParking(null);
        localStorage.removeItem("parkingInfo");
        setIsLoggedIn(false);
        console.log("User logged out");
    };


    return (
        <AuthContext.Provider value={{ login, parking, isLoggedIn, logout, isLoading, onError }}>
        {children}
        </AuthContext.Provider>
    );
};

