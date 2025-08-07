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

export default Tile;