import type React from "react";
import PieChartComp from "./PieChartComp";

 const slotData = [
    { name: 'Available', value: 7 },
    { name: 'Used', value: 5 },
  ];

const ZoneInfo: React.FC = ()=>{
    return (
        <div className="w-full mx-auto border-2 border-white p-3 grid grid-cols-1 items-center justify-center md:grid-cols-2 rounded-lg">
            <div className="p-3 w-full h-full gap-2 flex flex-col justify-start items-start mb-6">
                <h1 className='text-xl font-bold mb-3 mt-5'>Information</h1>
                <div className="flex-1"> </div>
                <code>
                    <h1 className='text-md font-bold mb-3'> <pre>Total Slots     : {10} </pre> </h1>
                    <h1 className='text-md font-bold mb-3'> <pre>Available Slots : {4} </pre> </h1>
                    <h1 className='text-md font-bold mb-3'> <pre>Occupied Slots  : {6} </pre> </h1>
                    <h1 className='text-md font-bold mb-3'> <pre>Fare (per hour) : {150} </pre> </h1>
                    <p className="text-sm text-gray-400">Please refresh for ensuring updates.</p>
                </code>
            </div>
            <PieChartComp slotData={slotData} availableSlots={7} totalSlots={10} />
        </div>
    )
}

export default ZoneInfo;