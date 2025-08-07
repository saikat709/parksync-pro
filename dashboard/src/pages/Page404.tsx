import React from 'react';
import { Link } from 'react-router-dom'; // or next/link if using Next.js

const Page404: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br p-3 mb-10">
      <h1 className="text-9xl font-extrabold mb-6 text-red-500 hover:scale-120 transition transition-transform duration-500">404</h1>
      <p className="text-2xl mb-4 hover:text-white/80 transition duration-500">Oops! Page not found.</p>
      <p className="mb-8 text-gray-400 max-w-md text-center hover:text-gray-100 ransition duration-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-purple-600 rounded-full text-white font-semibold hover:bg-green-400 hover:text-black transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default Page404;
