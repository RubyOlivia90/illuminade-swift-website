import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-inner-container">
        <Link to="/" className="navbar-title" onClick={() => setIsMenuOpen(false)}>
          Iluminade
        </Link>

        <button className="hamburger-menu" onClick={toggleMenu} aria-label="Toggle menu">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/gallery" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
          <Link to="/store" onClick={() => setIsMenuOpen(false)}>Store</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          <Link to="/checkout" className="cart-link" onClick={() => setIsMenuOpen(false)}>
            <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16.5" cy="18.5" r="1.5"/>
              <circle cx="9.5" cy="18.5" r="1.5"/>
              <path d="M18 16H8a1 1 0 0 1-.958-.713L4.256 6H3a1 1 0 0 1 0-2h2a1 1 0 0 1 .958.713L6.344 6H21a1 1 0 0 1 .937 1.352l-3 8A1 1 0 0 1 18 16zm-9.256-2h8.563l2.25-6H6.944z"/>
            </svg>
            Cart ({getTotalItems ? getTotalItems() : 0})
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
