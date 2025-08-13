import React, { useEffect } from "react";
import Right from "../assets/Right.svg";
import Modal from "./Modal";
import useAuth from "../hooks/useAuth";
import { getDateString, getFormattedTimeString, getTimeString, pyDateToJsDate } from "../utils/datetime";
import useWebSocket from "../hooks/useWebSocket";
import type { WSMessage } from "../libs/HookTypes";


type ParkingCompleteMessage = {   
    ending_time: string;
    fare: number;
};

const PersonalParking = () => {
    const [ isOpen, setIsOpen ] = React.useState(false);
    const [ duration, setDuration ] = React.useState(10);
    const { parking, completeParking } = useAuth();
    const { onMessage, removeHandler } = useWebSocket();

    const startTime = typeof parking?.starting_time === "string"
        ? pyDateToJsDate(parking.starting_time)
        : new Date();

    const completed = parking?.ending_time ? true : false;

    useEffect(() => {
        if ( completed ){
            setDuration(
                startTime && parking?.ending_time
                    ? Math.floor((new Date(parking.ending_time).getTime() - startTime.getTime()) / 1000)
                    : 0
            );
            return;
        }

        const timer = setInterval(() => {
            setDuration(prevDuration => prevDuration + 1);
        }, 1000); 

        const diff = Math.floor((Date.now() - startTime!.getTime()) / 1000);
        setDuration(diff > 0 ? diff : 0); 

        return () => clearInterval(timer); 
    }, [parking]);

    useEffect(() => {
        const handler = ( { event, data } : WSMessage ) => {
            console.log("Received message:", event, data);
            if ( event === "parking-id-" + parking?.parking_id ) {
                const typedData = data as ParkingCompleteMessage;
                completeParking(typedData.ending_time, typedData.fare);
            }
        };

        onMessage(handler);

        return () => {
            removeHandler("parking-id-" + parking?.parking_id, handler);
        };
    }, [onMessage, removeHandler]);


    return (
        <div
            className="fixed md:bottom-20 right-6 rounded-full 
                        border-blue-400 border-2 bg-gray-800 shadow-lg z-100 m-2
                        ">
                <button onClick={() => setIsOpen(true)} className="flex gap-2 justify-between items-center p-4 ">
                    <h1 className="text-xl font-bold text-white">Duration { getFormattedTimeString(duration) } </h1>
                    <img src={Right} alt="Right Arrow" className="w-8 h-8 text-white hover:scale-110 transition-transform duration-300" />
                </button>
            {isOpen && (
                <Modal isOpen={isOpen}
                    onClose={() => {
                        setIsOpen(false);
                        console.log("Modal closed");
                    }}>
                    <div className="bg-gray-700 text-white p-7 px-12 rounded shadow-lg flex flex-col items-center gap-2">
                        <h2 className="text-2xl font-bold mb-4 text-amber-800">Personal Parking Details</h2>
                        <pre>
                        <code className="flex flex-col items-start gap-1">
                            <p>Zone Id       : { parking?.zone_id } </p>
                            <p>Zone          : { parking?.zone_name } </p>
                            <p>Slot          : { `S00${ parking?.slot }` }</p>
                            <p>Parking Date  : { getDateString( startTime || new Date() ) } </p>
                            <p>Parking Time  : { getTimeString( startTime || new Date() ) } </p>
                            <p>Duration      : { getFormattedTimeString(duration) } </p>
                            <p>Fare          : { 
                                completed ? parking?.fare : duration * ( parking?.fare_rate  || 1 ) / 60 
                            } </p>
                            <p>Status        : <span className={`font-bold ${completed ? "text-green-300" : "text-amber-200" }`}>{ completed ? "Complete" : "Parked" } </span></p>
    
                        </code>
                        </pre>
                        <button
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-full rounded-full"
                            onClick={() => setIsOpen(false)}>
                            Close   
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}


export default PersonalParking;