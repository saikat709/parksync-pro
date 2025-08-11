import Lottie from 'lottie-react';
import vehicleAnimation from '../assets/Vehicle.json';
import { useParams } from 'react-router-dom';
import Page404 from './Page404';
import ZoneInfo from '../components/ZoneInfo';
import LogsList from '../components/LogList';

const validZones = {
    "a1": "Mokarrom Dhaban",
}


const SlotTile: React.FC<{ slotName: string; isOccupied: boolean }> = ({ slotName, isOccupied = false }) => {
    return (
        <div className={`relative flex flex-col items-start justify-start gap-0 py-0 px-0 rounded-xl shadow-lg text-white border-2 border-white-500 w-full h-56 overflow-hidden items-center justify-center ${isOccupied ? 'bg-red-600' : 'bg-green-600/90'}`}>
            { isOccupied ? 
                <Lottie animationData={vehicleAnimation } loop={true} className='w-full h-56'/>
                : 
                <div className='flex w-full h-full justify-center items-center font-bold text-4xl'> Usable </div>
            }
            <div className='h-8'></div>
            <h2 className='absolute bottom-0 left-0 font-bold text-center text-lg bg-blue-300 text-black w-full h-8 pb-3'>{slotName}</h2>
            <div className={`absolute top-0 right-0 ${ isOccupied ? 'bg-red-300' : 'bg-green-300' } text-black font-bold rounded-full px-2 py-1`}> <p> { isOccupied ? 'Occupied' : 'Available' }</p> </div>
        </div>
    );
}


const ZoneScreen: React.FC = () => {

    const { zoneId } = useParams<{ zoneId: string }>();
    // const navigate = useNavigate();

    if ( !zoneId || !Object.keys(validZones).includes(zoneId) ) {
        return <Page404 />;
    }

    return (

        <div className="w-[80%] mx-auto gap-3 flex flex-col items-center justify-start text-white">
            <h1 className="text-2xl font-bold m-3 mt-8">
                Zone &nbsp;
                <span className='bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent hover:scale-110 hover:drop-shadow-[10px_10px_20px_rgba(168,85,247,1)] transition-all duration-300'>
                    {(validZones[zoneId as keyof typeof validZones]?.toUpperCase()) || 'XYZ' } 
                 </span>
            </h1>
            <div className='w-full gap-2 flex items-center justify-between mb-6'>
                <SlotTile slotName='S001' isOccupied/>
                <SlotTile slotName='S002' isOccupied={false}/>
                <SlotTile slotName='S003' isOccupied={false}/>
            </div>
            <ZoneInfo />
            <LogsList />
            <div className='flex-1'></div>
        </div>
    );
}

export default ZoneScreen;