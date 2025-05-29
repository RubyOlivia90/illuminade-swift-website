import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Illuminade
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
          <Link to="/contact" className="text-gray-600 hover:text-indigo-600">About</Link>
          <Link to="/gallery" className="text-gray-600 hover:text-indigo-600">Gallery</Link>
          <Link to="/store" className="text-gray-600 hover:text-indigo-600">Store</Link>
          <Link to="/contact" className="text-gray-600 hover:text-indigo-600">Contact</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-gray-600 hover:text-indigo-600 focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link to="/" className="block text-gray-600 hover:text-indigo-600">Home</Link>
          <Link to="/gallery" className="block text-gray-600 hover:text-indigo-600">Gallery</Link>
          <Link to="/store" className="block text-gray-600 hover:text-indigo-600">Store</Link>
          <Link to="/contact" className="block text-gray-600 hover:text-indigo-600">Contact</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

