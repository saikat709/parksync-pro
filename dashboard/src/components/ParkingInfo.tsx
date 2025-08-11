import React from 'react';
import Tile from './Tile';

type InfoItem = {
  title: string;
  value: string | number;
  description?: string;
  colorClass: string; 
};

type ParkingInfoProps = {
  info?: InfoItem[];
};


const infoData = [
  {
    title: 'Total zones',
    value: '1/3',
    description: '1 Active',
    colorClass: 'bg-gradient-to-tr from-purple-500 to-indigo-600',
  },
  {
    title: 'Occupied / Empty',
    value: '3 / 6',
    description: 'total zone 6',
    colorClass: 'bg-gradient-to-tr from-green-400 to-teal-500',
  },
  {
    title: 'Average fare',
    value: '12.5 Tk',
    colorClass: 'bg-gradient-to-tr from-yellow-400 to-orange-500',
  },
  {
    title: 'Average time',
    value: '20 Min',
    colorClass: 'bg-gradient-to-tr from-pink-500 to-red-500',
  },
];

const ParkingInfo: React.FC<ParkingInfoProps> = ({ info = infoData }: ParkingInfoProps) => {
  return (
    <div>
        <h1 className='w-full mr-auto text-lg md:text-2xl font-bold  hover:drop-shadow-[0_0_5px_4px_rgba(255,99,255,0.3)]'> Parking </h1>
        <div className="flex flex-wrap gap-3 justify-left px-0 py-2">
        
        {info.map((tile, idx) => (
            <Tile
            key={idx}
            title={tile.title}
            value={tile.value}
            description={tile.description}
            colorClass={tile.colorClass}
            />
        ))}
        </div>
    </div>
  );
};

export default ParkingInfo;