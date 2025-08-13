import React from 'react';
import Tile from './Tile';


type ParkingInfoProps = {
  totalSlots?: number;
  availableSlots?: number;
  averageFare?: number;
  averageTime?: number;
};



const ParkingInfo: React.FC<ParkingInfoProps> = ({ totalSlots, availableSlots, averageFare, averageTime
 }: ParkingInfoProps) => {

  const infoData = [
    {
      title: 'Total zones',
      value: '1/3',
      description: '1 Active',
      colorClass: 'bg-gradient-to-tr from-purple-500 to-indigo-600',
    },
    {
      title: 'Available / Total',
      value: `${availableSlots || 0} / ${totalSlots || 0}`,
      description: `total slots ${totalSlots || 0}`,
      colorClass: 'bg-gradient-to-tr from-green-400 to-teal-500',
    },
    {
      title: 'Average fare',
      value: `${averageFare} Tk`,
      colorClass: 'bg-gradient-to-tr from-yellow-400 to-orange-500',
    },
    {
      title: 'Average time',
      value: `${averageTime} Min`,
      colorClass: 'bg-gradient-to-tr from-pink-500 to-red-500',
    },
  ];

  return (
    <div>
        <h1 className='w-full mr-auto text-lg md:text-2xl font-bold  hover:drop-shadow-[0_0_5px_4px_rgba(255,99,255,0.3)] text-center'> Parking ( All Zones ) </h1>
        <div className="flex flex-wrap gap-3 justify-center md:justify-start px-0 py-2">
        
        {infoData.map((tile, idx) => (
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