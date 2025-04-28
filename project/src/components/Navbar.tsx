import React from 'react';
import { Ambulance } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Ambulance className="h-8 w-8 text-red-500" />
            <span className="ml-2 text-xl font-bold text-gray-800">
              AmbulanceDetect
            </span>
          </div>
          <div className="flex items-center">
            <button 
              className="px-4 py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
              aria-label="Emergency Contact"
            >
              Emergency Contact
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;