import React from 'react';

type HeaderProps = {
  title: string;
  menuItems?: string[];
};

const Header: React.FC<HeaderProps> = ({
  title,
  menuItems = ['Home', 'About', 'Contact'],
}) => {
  return (
    <header
        className="mt-6 w-[90%] max-w-4xl px-8 py-3 rounded-full 
                    bg-white/10 backdrop-blur-md shadow-md border border-white/20 
                    flex items-center justify-between 
                    transition-shadow duration-300 
                    hover:shadow-[0_0_5px_4px_rgba(255,99,255,0.3)]"
        >
      <h1
        className="text-md md:text-2xl font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent transition duration-300 hover:drop-shadow-[0_0_6px_rgba(255,99,255,0.8)] transition-transform hover:scale-110"
        >
        {title}
      </h1>
      <nav className="flex gap-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="text-white text-md px-3 py-3 rounded-full transition transition-all duration-300 hover:scale-110 hover:bg-white hover:text-black"
          >
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
