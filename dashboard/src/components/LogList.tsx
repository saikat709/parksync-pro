import React from 'react';
import type { LogsListProps } from '../libs/ApiTypes';
import { Link } from 'react-router-dom';
import { typeColors } from '../libs/constValues';
import { getDateString, getTimeString, pyDateToJsDate } from '../utils/datetime';

const LogsList: React.FC<LogsListProps> = ({ hasMore, zone_id, logs }: LogsListProps) => {
  
  // console.log("LogList Zone ID:", zone_id);

  return (
    <div className="w-full overflow-x-auto border-2 border-blue-400 flex-1 p-2 sm:p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-md text-white">
      <div className='flex flex-row justify-between items-start items-center mb-4 gap-2'>
        <h2 className="text-lg sm:text-xl font-semibold">Activity Logs</h2>
    
        { hasMore && <Link
            to={ zone_id ? `/logs?zone=${zone_id}` : '/logs' }
            className="px-3 py-2 sm:px-4 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors whitespace-nowrap">
            See All
          </Link>
        }
      </div>
      <div className="overflow-x-auto">
        <ul className="divide-y divide-white/20 min-w-full">
          <li className="py-2 sm:py-3 flex flex-row justify-between items-center bg-white/5 rounded-lg mb-2 p-2 min-w-[600px] sm:min-w-0">
              <div className={`font-semibold uppercase tracking-wide text-xs sm:text-sm flex-shrink-0 w-[18%] sm:w-[20%]`}>Type</div>
              <div className="font-semibold text-xs sm:text-sm uppercase tracking-wide text-center flex-shrink-0 w-[18%] sm:w-[20%]">Date</div>
              <div className='font-semibold text-xs sm:text-sm uppercase tracking-wide text-center flex-shrink-0 w-[18%] sm:w-[20%]'>Time</div>
              {/* <div className='font-semibold text-xs sm:text-sm uppercase tracking-wide text-center flex-shrink-0 w-[16%] sm:w-[10%]'>Slot</div> */}
              <div className='font-semibold text-xs sm:text-sm uppercase tracking-wide text-center flex-shrink-0 w-[18%] sm:w-[20%]'>Zone</div>
          </li>

        { logs && logs.length === 0 && (
          <li className="py-3 text-center text-gray-400">No logs available</li>
        )}

        { logs && logs.map(({ type, date, zone, slot }, idx) => {
          
          // console.log("Date conversion: ", getTimeString(pyDateToJsDate(date) || new Date()));

          const dateObj = pyDateToJsDate(date);


          return ( 
          <li key={idx} className="py-2 flex flex-row justify-between items-center px-2 hover:bg-white/10 transition-colors duration-300 min-w-[600px] sm:min-w-0">
            <div className={`font-semibold ${typeColors[type]} uppercase tracking-wide text-xs sm:text-sm flex-shrink-0 w-[18%] sm:w-[20%] truncate`}>
                {type}
            </div>
            <div className="text-xs sm:text-sm text-gray-300 text-center flex-shrink-0 w-[18%] sm:w-[20%] truncate">
                {getDateString(dateObj || new Date())}
            </div>
            <div className='text-xs sm:text-sm text-gray-300 text-center flex-shrink-0 w-[18%] sm:w-[20%] truncate'>
                {getTimeString(dateObj || new Date())}
            </div>
            {/* <div className='text-xs sm:text-sm text-gray-300 text-center flex-shrink-0 w-[16%] sm:w-[10%] truncate'>
                {slot }
            </div> */}
            <div className='text-xs sm:text-sm text-gray-300 text-center flex-shrink-0 w-[18%] sm:w-[20%] truncate'>
                {zone }
            </div>
            {/* <p className="mt-1 sm:mt-0 sm:ml-6 text-gray-200 min-w-[40%]">{zone}</p> */}
          </li>
        )})}
        </ul>
      </div>
    </div>
  );
};

export default LogsList;
