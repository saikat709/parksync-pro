import React from 'react';

type InfoItem = {
  label: string;
  value: string | number;
  description?: string;
};

type ParkingInfoProps = {
  info: InfoItem[];
};


type TileProps = {
  title: string;
  value: string | number;
  description?: string;
  colorClass: string; // Tailwind bg color class
};

const Tile: React.FC<TileProps> = ({ title, value, description, colorClass }) => {
  return (
    <div
      className={`flex flex-col p-6 rounded-xl shadow-lg text-white w-48
                  ${colorClass} hover:scale-105 transition-transform duration-300`}
    >
      <span className="text-4xl font-extrabold">{value}</span>
      <span className="mt-2 font-semibold">{title}</span>
      {description && <span className="mt-1 text-sm opacity-80">{description}</span>}
    </div>
  );
};


const ParkingInfo: React.FC<ParkingInfoProps> = ({ info }) => {
  return (
    <div>
        <h1 className='text-lg md:text-2xl font-bold  hover:drop-shadow-[0_0_5px_4px_rgba(255,99,255,0.3)]'> Parking </h1>
        <div className="flex flex-wrap gap-6 justify-center px-0 py-6">
        
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