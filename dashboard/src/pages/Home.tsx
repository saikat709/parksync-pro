import Analysis from "../components/Analysis";
import LogsList from "../components/LogList";
import ParkingInfo from "../components/ParkingInfo";
import Zones from "../components/Zones";



const Home = () => {
    return (
        <div className="flex-1 w-[100%]">
            <Analysis />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-between items-top px-4 py-3 mx-auto">
              <ParkingInfo />
              <Zones />
            </div>
            <LogsList hasMore/>
        </div>
    );
}

export default Home;