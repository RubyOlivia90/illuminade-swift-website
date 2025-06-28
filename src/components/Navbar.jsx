import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner-container"> 
        {/* --- Home/Title link on the far left --- */}
        <Link to="/" className="navbar-title" onClick={() => setIsMenuOpen(false)}>Iluminade</Link> 

        {/* Hamburger Icon for mobile - still conditionally displayed by CSS */}
        <button className="hamburger-menu" onClick={toggleMenu} aria-label="Toggle navigation menu">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>

        {/* --- Other navigation links grouped on the far right --- */}
        <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/gallery" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
          <Link to="/store" onClick={() => setIsMenuOpen(false)}>Store</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          <Link to="/checkout" onClick={() => setIsMenuOpen(false)}>Checkout</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;