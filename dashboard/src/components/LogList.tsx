import axios from 'axios';
import React, { useEffect } from 'react';

type LogType = 'enter' | 'exit' | 'parked' | 'moved';

type LogItem = {
  type: LogType;
  time: string; 
  date: string;
  message: string;
};

type LogsListProps = {
  logs?: LogItem[];
  hasMore?: boolean;
};


const sampleLogs: LogItem[] = [
  { type: 'enter',  date: '2025-08-07', time: '08:30', message: 'Car ABC123 entered the zone.' },
  { type: 'parked', date: '2025-08-07', time: '08:35', message: 'Car ABC123 parked in slot 4.' },
  { type: 'moved',  date: '2025-08-07', time: '10:15', message: 'Car ABC123 moved to slot 7.' },
  { type: 'exit',   date: '2025-08-07', time: '12:00', message: 'Car ABC123 exited the zone.' },
];


const typeColors: Record<LogType, string> = {
  enter: 'text-green-400',
  exit: 'text-red-400',
  parked: 'text-yellow-400',
  moved: 'text-blue-400',
};

const apiUrl = import.meta.env.VITE_API_URL;

const LogsList: React.FC<LogsListProps> = ({ hasMore }: LogsListProps) => {
  
  const [ logsList, setLogsList ] = React.useState<LogItem[]| null>(null);

  useEffect(()=> {
        const fetchZoneInfo = async () => {
            try {
                const response = await axios.get(`${apiUrl}/log/?page=1&page_size=10`);
                setLogsList(response.data);
                console.log("Zone Info:", logsList);
            } catch (error) {
                console.error("Error fetching zone info:", error);
            }
        };
        setLogsList(sampleLogs); // For testing purposes
        fetchZoneInfo();
    }, [] );

  return (
    <div className="w-full overflow-x-scroll border-2 border-blue-400 flex-1 p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-md text-white">
      <div className='flex flex-col sm:flex-row justify-between items-center mb-2'>
        <h2 className="text-xl font-semibold mb-4">Activity Logs</h2>
    
        { hasMore && <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            See All
          </button>
        }
      </div>
      <ul className="divide-y divide-white/20">
        <li className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white/5 rounded-lg mb-2 p-2">
            <div className={`font-semibold uppercase tracking-wide min-w-[20%]`}>Type</div>
            <div className="font-semibold text-sm uppercase tracking-wide sm:text-left min-w-[20%]">Date</div>
            <div className='font-semibold text-sm uppercase tracking-wide sm:text-left min-w-[20%]'> Time </div>
            <p className="font-semibold mt-1 sm:mt-0 sm:ml-6 uppercase tracking-wide min-w-[40%]">Message</p>
        </li>
        {logsList && sampleLogs.map(({ type, time, date, message }, idx) => (
          <li key={idx} className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center px-2 hover:bg-white/10 transition-colors duration-300">
            <div className={`font-semibold ${typeColors[type]} uppercase tracking-wide min-w-[20%]`}>
                {type}
            </div>
            <div className="text-sm text-gray-300 sm:text-left min-w-[20%]">
                {date}
            </div>
            <div className='text-sm text-gray-300 sm:text-left min-w-[20%]'>
                {time}
            </div>
            <p className="mt-1 sm:mt-0 sm:ml-6 text-gray-200 min-w-[40%]">{message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogsList;
