import React from 'react';
import Tile from './Tile';

type Zone = {
  title: string;
  description: string;
  value: string;
  colorClass: string;
  disabled?: boolean;
};

const zones: Zone[] = [
  {
    title: 'Zone A',
    description: 'Main parking area',
    value: '5 / 10',
    colorClass: 'bg-gradient-to-tr from-blue-300 to-blue-600',
    disabled: false,
  },
  {
    title: 'Zone B',
    description: 'Near the entrance',
    value: '3 / 5',
    colorClass: 'bg-gradient-to-tr from-green-500 to-green-700',
    disabled: true,
  },
  {
    title: 'Zone C',
    description: 'VIP parking',
    value: '2 / 2',
    colorClass: 'bg-gradient-to-tr from-purple-500 to-purple-700',
    disabled: true,
  },
];

const Zones: React.FC = () => {
  return (
    <section className="px-4 py-6">
      <h1 className="text-lg md:text-3xl font-bold mb-6 
                     hover:drop-shadow-[0_0_8px_rgba(255,99,255,0.5)] 
                     transition-shadow duration-300 cursor-default">
        Parking Zones
      </h1>
      <div className="flex flex-wrap gap-6 justify-left">
        {zones.map(({ disabled, ...tile }, idx) => (
          <Tile
            key={idx}
            {...tile}
            colorClass={disabled ? `opacity-50 cursor-not-allowed ${tile.colorClass}` : `cursor-pointer hover:scale-105 transition-transform duration-300 ${tile.colorClass}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Zones;
