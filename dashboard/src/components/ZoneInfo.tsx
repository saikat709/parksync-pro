import type React from "react";
import PieChartComp from "./PieChartComp";
import type { ZoneInfoType } from "../libs/ApiTypes";

 const slotData = [
    { name: 'Available', value: 7 },
    { name: 'Used', value: 5 },
  ];

const ZoneInfo: React.FC<ZoneInfoType> = ({ total_slots, slots, fare }: ZoneInfoType)=>{

    // console.log("Zone Info:", total_slots);

    return (
        <div className="w-full mx-auto border-2 border-white p-3 grid grid-cols-1 items-center justify-center md:grid-cols-2 rounded-lg">
            <div className="p-3 w-full h-full gap-2 flex flex-col justify-start items-start mb-6">
                <h1 className='text-xl font-bold mb-3 mt-5'>Information</h1>
                <div className="flex-1"> </div>
                <code>
                    <h1 className='text-md font-bold mb-3'> <pre>Total Slots     : {total_slots || 0} </pre> </h1>
                    <h1 className='text-md font-bold mb-3'> <pre>Available Slots : {total_slots - slots.filter(v => v).length }  </pre> </h1>
                    <h1 className='text-md font-bold mb-3'> <pre>Occupied Slots  : {slots.filter(v => v).length} </pre> </h1>
                    <h1 className='text-md font-bold mb-3'> <pre>Fare (per hour) : {fare} </pre> </h1>
                    <p className="text-sm text-gray-400">Please refresh for ensuring updates.</p>
                </code>
            </div>
            <PieChartComp slotData={slotData} availableSlots={7} totalSlots={10} />
        </div>
    )
}

export default ZoneInfo;