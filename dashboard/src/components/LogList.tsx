import React from 'react';
import type { LogsListProps } from '../libs/ApiTypes';
import { Link } from 'react-router-dom';
import { typeColors } from '../libs/constValues';

const LogsList: React.FC<LogsListProps> = ({ hasMore, zone_id, logs }: LogsListProps) => {
  
  // console.log("LogList Zone ID:", zone_id);

  return (
    <div className="w-full overflow-x-scroll border-2 border-blue-400 flex-1 p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-md text-white">
      <div className='flex flex-col sm:flex-row justify-between items-center mb-2'>
        <h2 className="text-xl font-semibold mb-4">Activity Logs</h2>
    
        { hasMore && <Link
            to={ zone_id ? `/logs?zone=${zone_id}` : '/logs' }
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            See All
          </Link>
        }
      </div>
      <ul className="divide-y divide-white/20">
        <li className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white/5 rounded-lg mb-2 p-2">
            <div className={`font-semibold uppercase tracking-wide min-w-[20%]`}>Type</div>
            <div className="font-semibold text-sm uppercase tracking-wide sm:text-center min-w-[20%]"> Date</div>
            <div className='font-semibold text-sm uppercase tracking-wide sm:text-center min-w-[20%]'> Time </div>
            <div className='font-semibold text-sm uppercase tracking-wide sm:text-center min-w-[10%]'> Slot </div>
            <div className='font-semibold text-sm uppercase tracking-wide sm:text-center min-w-[20%]'> Zone </div>
        </li>

        { logs && logs.length === 0 && (
          <li className="py-3 text-center text-gray-400">No logs available</li>
        )}

        { logs && logs.map(({ type, date, zone, slot }, idx) => {
          
          const dateObj = new Date(date.slice(0, 23));

          const datePart = dateObj.toLocaleDateString("en-GB"); 
          const timePart = dateObj.toLocaleTimeString("en-GB", { hour12: false });


          return ( <li key={idx} className="py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center px-2 hover:bg-white/10 transition-colors duration-300">
            <div className={`font-semibold ${typeColors[type]} uppercase tracking-wide min-w-[20%]`}>
                {type}
            </div>
            <div className="text-sm text-gray-300 sm:text-center min-w-[20%]">
                {datePart}
            </div>
            <div className='text-sm text-gray-300 sm:text-center min-w-[20%]'>
                {timePart}
            </div>
            <div className='text-sm text-gray-300 sm:text-center min-w-[20%]'>
                {slot }
            </div>
            <div className='text-sm text-gray-300 sm:text-center min-w-[20%]'>
                {zone }
            </div>
            {/* <p className="mt-1 sm:mt-0 sm:ml-6 text-gray-200 min-w-[40%]">{zone}</p> */}
          </li>
        )})}
      </ul>
    </div>
  );
};

export default LogsList;
