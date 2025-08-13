import React from 'react';
import Tile from './Tile';
import { useNavigate } from 'react-router-dom';

type Zone = {
  title: string;
  description: string;
  value: string;
  colorClass: string;
  disabled?: boolean;
  url?: string;
};

type ZoneProps = {
  totalSlots?: number;
  availableSlots?: number;
}

const Zones: React.FC<ZoneProps> = ({totalSlots, availableSlots}: ZoneProps) => {
  const navigate = useNavigate();

  const zones: Zone[] = [
    {
      title: 'Zone A',
      description: 'Main parking area',
      value: `${availableSlots || 0} / ${totalSlots || 0}`,
      colorClass: 'bg-gradient-to-tr from-blue-300 to-blue-600',
      disabled: false,
      url: '/zones/a1',
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


  return (
    <section className="px-0 py-2 mb-2" id='zones'>
      <div>
        <h1 className="text-lg md:text-2xl font-bold mb-3
                      hover:drop-shadow-[0_0_8px_rgba(255,99,255,0.5)] 
                      transition-shadow duration-300 cursor-default text-center">
          Parking Zones
        </h1>
        <div className="flex flex-wrap gap-3 justify-center md:justify-left mx-auto">
          {zones.map(({ disabled, ...tile }, idx) => (
            <Tile
              key={idx}
              {...tile}
              colorClass={`${tile.colorClass}`}
              onClick={() => {
                if (!disabled && tile.url) {
                  navigate(tile.url);
                }
              }}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Zones;
