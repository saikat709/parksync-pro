import Lottie from 'lottie-react';
import vehicleAnimation from '../assets/Vehicle.json';
import { useParams } from 'react-router-dom';
import Page404 from './Page404';

const validZones = {
    "a1": "Mokarrom Dhaban",
}


const SlotTile: React.FC<{ slotName: string; isOccupied: boolean }> = ({ slotName, isOccupied = false }) => {
    return (
        <div className={`relative flex flex-col py-0 px-0 rounded-xl shadow-lg text-white border-2 border-white-500 w-56 h-56 overflow-hidden items-center justify-center ${isOccupied ? 'bg-red-600' : 'bg-green-600/90'}`}>
            { isOccupied ? 
                <Lottie animationData={vehicleAnimation } loop={true} className='w-56 h-56'/>
                : 
                <div className='flex w-full h-full justify-center items-center font-bold text-4xl'> Usable </div>
            }
            <div className='flex-1'></div>
            <h2 className='font-bold text-lg mb-2'>{slotName}</h2>
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

        <div className="flex flex-col items-center justify-start text-white">
            <h1 className="text-2xl font-bold mb-4">
                Zone &nbsp;
                <span className='bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent hover:scale-110 hover:drop-shadow-[10px_10px_20px_rgba(168,85,247,1)] transition-all duration-300'>
                    {(validZones[zoneId as keyof typeof validZones]?.toUpperCase()) || 'XYZ' } 
                 </span></h1>
            <div className='w-full gap-2 flex items-center justify-center mb-6'>
                <SlotTile slotName='S001' isOccupied/>
                <SlotTile slotName='S002' isOccupied={false}/>
                <SlotTile slotName='S003' isOccupied={false}/>
            </div>
            <div className='w-full gap-2 justify-start mb-6'>
                <h1 className='text-lg font-semibold'>Information</h1>
                <div>
                    <h1 className='text-center text-xl font-bold mb-3'> Total Slots {3} </h1>
                </div>
            </div>
            <p className="text-lg mb-4">This page is under construction.</p>
            <p className="text-sm text-gray-400">Please check back later for updates.</p>
            <div className='flex-1'></div>
        </div>
    );
}

export default ZoneScreen;