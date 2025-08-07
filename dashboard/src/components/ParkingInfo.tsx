import React from 'react';
import Tile from './Tile';

type InfoItem = {
  title: string;
  value: string | number;
  description?: string;
  colorClass: string; 
};

type ParkingInfoProps = {
  info: InfoItem[];
};

const ParkingInfo: React.FC<ParkingInfoProps> = ({ info }: { info: InfoItem[] }) => {
  return (
    <div>
        <h1 className='w-full mr-auto text-lg md:text-2xl font-bold  hover:drop-shadow-[0_0_5px_4px_rgba(255,99,255,0.3)]'> Parking </h1>
        <div className="flex flex-wrap gap-6 justify-left px-0 py-6">
        
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