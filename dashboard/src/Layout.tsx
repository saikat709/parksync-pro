import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";

const Layout = () => {
    return (
        <>
        <div
            className="flex flex-col justify-between items-center gap-2 min-w-screen min-h-screen
                        bg-gradient-to-br from-gray-900 to-black"
                        >
            <Header title="ParkSync.Pro" />
            <div className="mx-auto w-[80vw]">
                <Outlet />
            </div>
            <Footer />
        </div>
        </>
    );
}

export default Layout;