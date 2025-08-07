import Analysis from "../components/Analysis";
import LogsList from "../components/LogList";
import ParkingInfo from "../components/ParkingInfo";
import Zones from "../components/Zones";

const infoData = [
  {
    title: 'Total zones',
    value: '1/3',
    description: '1 Active',
    colorClass: 'bg-gradient-to-tr from-purple-500 to-indigo-600',
  },
  {
    title: 'Occupied / Empty',
    value: '3 / 6',
    description: 'total zone 6',
    colorClass: 'bg-gradient-to-tr from-green-400 to-teal-500',
  },
  {
    title: 'Average fare',
    value: '12.5 Tk',
    colorClass: 'bg-gradient-to-tr from-yellow-400 to-orange-500',
  },
  {
    title: 'Average time',
    value: '20 Min',
    colorClass: 'bg-gradient-to-tr from-pink-500 to-red-500',
  },
];


const sampleLogs = [
  { type: 'enter',  date: '2025-08-07', time: '08:30', message: 'Car ABC123 entered the zone.' },
  { type: 'parked', date: '2025-08-07', time: '08:35', message: 'Car ABC123 parked in slot 4.' },
  { type: 'moved',  date: '2025-08-07', time: '10:15', message: 'Car ABC123 moved to slot 7.' },
  { type: 'exit',   date: '2025-08-07', time: '12:00', message: 'Car ABC123 exited the zone.' },
];



const Home = () => {
    return (
        <div className="flex-1 w-[100%]">
            <Analysis />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-between items-top px-4 py-3 mx-auto">
              <ParkingInfo info={infoData}/>
              <Zones />
            </div>
            <LogsList logs={sampleLogs} />
        </div>
    );
}

export default Home;