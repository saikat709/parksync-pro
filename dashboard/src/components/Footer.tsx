import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white/5 backdrop-blur-md text-white py-10 px-8 mt-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Branding */}
        <div className="text-xl font-semibold tracking-wide">
          © 2025 ParkSync.Pro
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
          <a href="#" className="hover:text-white transition hover:underline underline-offset-6">Privacy Policy</a>
          <a href="#" className="hover:text-white transition  hover:underline underline-offset-6">Terms of Service</a>
          <a href="https://www.github.com/saikat709" target='_blank' className="hover:text-white transition  hover:underline underline-offset-6">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
