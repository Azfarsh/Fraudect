import React, { useState } from 'react';
import { 
 
  
  Shield, 
  
} from 'lucide-react';
const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header
      className="w-full py-1 px-3 shadow-md flex justify-between items-center"
      style={{ background: 'linear-gradient(80deg, #00188f, #EC008C)' }}
    >
      <div className="flex items-center">
        <a href="http://localhost:3000/">
        <div className="flex items-center ml-3"> 
  <Shield size={24} className="text-white" />
  <span className="text-2xl font-bold ml-2 text-white">
    Fraudect
  </span>
</div>

        </a>
      </div>
      <nav className="flex space-x-8">
        <a href="http://localhost:3000/" className="text-white hover:text-gray-200">Home</a>
        <a href="http://localhost:3000/chatbot" className="text-white hover:text-gray-200">Chatbot</a>
        <a href="http://localhost:3000/services" className="text-white hover:text-gray-200">Services</a>
        <a href="http://localhost:3000/about" className="text-white hover:text-gray-200">Interview</a>
  
      </nav>
      <div className="flex items-center relative">
        <div
          className="bg-white text-purple-600 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
          onClick={toggleDropdown}
        >
          U
        </div>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <a href="http://localhost:3000/profile" className="block px-4 py-2 text-black hover:bg-gray-100">My Profile</a>
            <a href="http://localhost:3000/" className="block px-4 py-2 text-black hover:bg-gray-100">Log Out</a>
          </div>
        )}
        <a href="/login">
          <button className="ml-4 bg-purple-700 text-white px-4 py-1 rounded hover:bg-purple-800 shadow-md">GET STARTED</button>
        </a>
      </div>
    </header>
  );
};

export default Navbar;
