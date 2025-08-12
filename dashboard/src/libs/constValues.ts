import type { LogItem } from "./ApiTypes";


const validZones = {
    "a1": "Mokarrom Dhaban",
}


const sampleLogs: LogItem[] = [
  { type: 'enter',  date: '2025-08-07', time: '08:30', message: 'Car ABC123 entered the zone.' },
  { type: 'parked', date: '2025-08-07', time: '08:35', message: 'Car ABC123 parked in slot 4.' },
  { type: 'moved',  date: '2025-08-07', time: '10:15', message: 'Car ABC123 moved to slot 7.' },
  { type: 'exit',   date: '2025-08-07', time: '12:00', message: 'Car ABC123 exited the zone.' },
];


const typeColors: Record<string, string> = {
  enter: 'text-green-400',
  exit: 'text-red-400',
  parked: 'text-yellow-400',
  moved: 'text-blue-400',
};


export { validZones, typeColors, sampleLogs }; 