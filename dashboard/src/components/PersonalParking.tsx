import React, { useEffect } from "react";
import Right from "../assets/Right.svg";
import Modal from "./Modal";

const PersonalParking = () => {
    const [ isOpen, setIsOpen ] = React.useState(true);
    const [ duration, setDuration ] = React.useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setDuration(prevDuration => prevDuration + 1);
        }, 100); 

        return () => clearInterval(timer); 
    }, []);

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    return (
        <button
            className="fixed bottom-0 right-0 rounded-full 
                        border-blue-400 border-2 p-4 m-4 bg-gray-800 shadow-lg z-100 
                        flex gap-2 justify-between items-center"
            onClick={() => setIsOpen(!isOpen)}>
                <h1 className="text-xl font-bold text-white">Duration { formatted } </h1>
                <img src={Right} alt="Right Arrow" className="w-8 h-8 text-white hover:scale-110 transition-transform duration-300" />
            {isOpen && (
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <div className="bg-gray-700 text-white p-7 px-12 rounded shadow-lg flex flex-col items-center gap-2">
                        <h2 className="text-xl font-bold mb-6">Personal Parking Details</h2>
                        <pre>
                        <code className="flex flex-col items-start gap-1">
                            <p>Zone    : IIT Parking</p>
                            <p>Slot    : S001</p>
                            <p>Status  : Available</p>
                            <p>Duration: 10 minutes</p>
                            <p>Time    : { formatted } </p>
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
        </button>
    );
}


export default PersonalParking;