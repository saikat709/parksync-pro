import type React from "react";
import vehicleAnimation from '../assets/Vehicle.json';
import Lottie from 'lottie-react';

const SlotTile: React.FC<{ slotName: string; isOccupied: boolean }> = ({ slotName, isOccupied = false }) => {

    return (
        <div className={`relative flex flex-col items-start justify-start gap-0 py-0 px-0 rounded-xl shadow-lg text-white border-2 border-white-500 w-full h-34 md:h-56 overflow-hidden items-center justify-center ${isOccupied ? 'bg-red-600' : 'bg-green-600/90'}`}>
            { isOccupied ? 
                <Lottie animationData={vehicleAnimation } loop={true} className='w-full h-56'/>
                : 
                <div className='flex w-full h-full justify-center items-center font-bold text-lg md:text-4xl'> Usable </div>
            }
            <div className='h-8'></div>
            <h2 className='absolute bottom-0 left-0 font-bold text-center text-md md:text-lg bg-blue-300 text-black w-full h-8 pb-3'>{slotName}</h2>
            <div className={`absolute top-0 right-0 ${ isOccupied ? 'bg-red-300' : 'bg-green-300' } text-black font-bold rounded-full px-2 py-1`}> <p> { isOccupied ? 'Occupied' : 'Available' }</p> </div>
        </div>
    );
}

export default SlotTile;