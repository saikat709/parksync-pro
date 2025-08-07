type TileProps = {
  title: string;
  value: string | number;
  description?: string;
  colorClass: string; 
  onClick?: () => void;
  disabled?: boolean;
};

const Tile: React.FC<TileProps> = ({ title, value, description, colorClass, onClick, disabled }) => {
  return (
    <div
      className={`flex flex-col py-3 px-3 rounded-xl shadow-lg text-white w-36 h-32
                  ${colorClass} ${ disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-default hover:shadow-lg hover:scale-115 transition-transform duration-300 '} ${ ( onClick && !disabled ) && 'cursor-pointer'}`}
      onClick={() => onClick && onClick()}
    >
      <span className="text-3xl font-extrabold">{value}</span>
      <span className="mt-1 font-semibold">{title}</span>
      {description && <span className="mt-1 text-sm opacity-80">{description}</span>}
    </div>
  );
};

export default Tile;