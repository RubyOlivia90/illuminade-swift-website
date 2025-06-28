// After
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useCart } from '../CartContext'; // Import useCart hook

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart(); // Get getTotalItems from cart context

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
          {/* Replaced Checkout link with Cart link and icon */}
          <Link to="/checkout" className="cart-link" onClick={() => setIsMenuOpen(false)}>
            <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="cart-icon">
              <circle cx="16.5" cy="18.5" r="1.5"/>
              <circle cx="9.5" cy="18.5" r="1.5"/>
              <path d="M18 16H8a1 1 0 0 1-.958-.713L4.256 6H3a1 1 0 0 1 0-2h2a1 1 0 0 1 .958.713L6.344 6H21a1 1 0 0 1 .937 1.352l-3 8A1 1 0 0 1 18 16zm-9.256-2h8.563l2.25-6H6.944z"/>
            </svg>
            Cart ({getTotalItems()})
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;