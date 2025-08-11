import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Modal from './Modal';
import EnterForm from './EnterForm';

type HeaderProps = {
  title: string;
  menuItems?: string[];
};

const Header: React.FC<HeaderProps> = ({
  title,
  menuItems = ['Home', 'About', 'Contact'],
}) => {
  
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  
  useEffect(() => {
    if (location.hash) {
        const element = document.getElementById(location.hash.substring(1)); // Remove '#'
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
  }, [location]);
  
  return (
    <>
    <header
        className="mt-6 w-[100%] max-w-4xl px-8 py-3 rounded-full 
            bg-white/10 backdrop-blur-md shadow-md border border-white/20 
            flex items-center justify-between 
            transition-shadow duration-300 
            hover:shadow-[0_0_5px_4px_rgba(255,99,255,0.3)]"
        >
      <h1
        className="text-md md:text-2xl font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent transition duration-300 hover:drop-shadow-[0_0_6px_rgba(255,99,255,0.8)] transition-transform hover:scale-110 flex gap-2"
      >
        <img src='/car.svg' alt='car' width={34} height={34} className='hover:scale-140 transition transition-transform duration-300'/>
        <Link to={'/'}>{title}</Link>
      </h1>
      <nav className="flex gap-4">

        {/* { ( pathname === '/' || pathname === '/home' ) && <Link to={'/#zones'} className="text-white text-md px-3 py-3 rounded-full transition transition-all duration-300 hover:scale-110 hover:bg-white hover:text-black">Zones</Link> } */}

        {menuItems.map((item, index) => (
          <Link
            key={index}
            className="text-white text-md px-3 py-3 rounded-full transition transition-all duration-300 hover:scale-110 hover:bg-white hover:text-black"
            to={`/${item.toLowerCase()}`}
          >
            {item}
          </Link>
        ))}
        <button
          className="bg-blue-300 px-5 text-black font-bold text-md px-3 py-3 rounded-full transition transition-all duration-300 hover:scale-110 hover:bg-white hover:text-black"
          onClick={() => setIsOpen(!isOpen)}
        >
          Enter
        </button>
      </nav>

    </header>

     { isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <EnterForm onClose={()=>setIsOpen(false)}/>
        </Modal>
        )
      }
    </>
  );
};

export default Header;
