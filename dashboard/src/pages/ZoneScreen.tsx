import Lottie from 'lottie-react';
import vehicleAnimation from '../assets/Vehicle.json';
import { useParams } from 'react-router-dom';
import Page404 from './Page404';
import ZoneInfo from '../components/ZoneInfo';
import LogsList from '../components/LogList';
import axios from 'axios';
import React, { useEffect } from 'react';
import type { ZoneInfoType } from '../libs/ApiTypes';
import SlotTile from '../components/SlotTile';

const validZones = {
    "a1": "Mokarrom Dhaban",
}

const apiUrl = import.meta.env.VITE_API_URL;

const ZoneScreen: React.FC = () => {
    const { zoneId } = useParams<{ zoneId: string }>();
    const [ zoneInfo, setZoneInfo] = React.useState<ZoneInfoType | null>(null);

    useEffect(()=> {
        const fetchZoneInfo = async () => {
            try {
                const response = await axios.get(`${apiUrl}/zone/${zoneId}`);
                setZoneInfo(response.data);
                console.log("Zone Info:", response.data);
            } catch (error) {
                console.error("Error fetching zone info:", error);
            }
        };
        fetchZoneInfo();
    }, [zoneId] );

    if ( !zoneId || !Object.keys(validZones).includes(zoneId) ) {
        return <Page404 />;
    } 

    if ( !zoneInfo ) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <Lottie animationData={vehicleAnimation} loop={true} className='w-64 h-64' />
            </div>
        );
    }

    return (

        <div className="w-[80%] mx-auto gap-3 flex flex-col items-center justify-start text-white">
            <h1 className="text-2xl font-bold m-3 mt-8">
                Zone &nbsp;
                <span className='bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent hover:scale-110 hover:drop-shadow-[10px_10px_20px_rgba(168,85,247,1)] transition-all duration-300'>
                    {( zoneInfo?.name?.toUpperCase() ) || 'XYZ' } 
                 </span>
            </h1>
            <div className='w-full gap-2 flex items-center justify-between mb-6'>
                { zoneInfo?.slots?.slice(0, 3).map((slot, index) => (
                    <SlotTile key={index}
                        slotName={`S00${index + 1}`}
                        isOccupied={slot} 
                        />
                )) }
            </div>
            <ZoneInfo {...zoneInfo}/>
            <LogsList />
            <div className='flex-1'></div>
        </div>
    );
}

export default ZoneScreen;