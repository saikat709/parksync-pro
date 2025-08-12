import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useEffect } from "react";
import useWebSocket from "./hooks/useWebSocket";
import type { SocketTestData, WSMessage } from "./libs/HookTypes";
import PersonalParking from "./components/PersonalParking";
import useAuth from "./hooks/useAuth";

const Layout = () => {
    const { onMessage, removeHandler } = useWebSocket();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        const handler = ( {event, data}: WSMessage ) => {
            if (event === "test") {
                const testData: SocketTestData = data as SocketTestData;
                console.log("Message received in RootLayout:", testData.message);
            }
        };
        onMessage(handler);
        return () => removeHandler(handler);
    }, [onMessage, removeHandler]);
    
    return (
        <>
        <div
            className="flex flex-col justify-between items-center gap-2 min-w-screen min-h-screen
                        bg-gradient-to-br from-gray-900 to-black"
                        >
            <Header title="ParkSync.Pro" />
            <div className="mx-auto w-full md:w-[80vw]">
                <Outlet />
            </div>
           { isLoggedIn && <PersonalParking />}
            <Footer />
        </div>
        </>
    );
}

export default Layout;