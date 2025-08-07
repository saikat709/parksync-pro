import React from 'react';

type LogType = 'enter' | 'exit' | 'parked' | 'moved';

type LogItem = {
  type: LogType;
  time: string; 
  date: string;
  message: string;
};

type LogsListProps = {
  logs: LogItem[];
};

const typeColors: Record<LogType, string> = {
  enter: 'text-green-400',
  exit: 'text-red-400',
  parked: 'text-yellow-400',
  moved: 'text-blue-400',
};

const LogsList: React.FC<LogsListProps> = ({ logs }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-md text-white">
      <h2 className="text-xl font-semibold mb-4">Activity Logs</h2>
      <ul className="divide-y divide-white/20">
        <li className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white/5 rounded-lg mb-2 p-2">
            <div className={`font-semibold uppercase tracking-wide min-w-[20%]`}>Type</div>
            <div className="font-semibold text-sm uppercase tracking-wide sm:text-left min-w-[20%]">Date</div>
            <div className='font-semibold text-sm uppercase tracking-wide sm:text-left min-w-[20%]'> Time </div>
            <p className="font-semibold mt-1 sm:mt-0 sm:ml-6 uppercase tracking-wide min-w-[40%]">Message</p>
        </li>
        {logs.map(({ type, time, date, message }, idx) => (
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
