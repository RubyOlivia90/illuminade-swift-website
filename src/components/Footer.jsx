// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import '../footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-brand">
          <Link to="/" className="footer-title">
            Iluminade
          </Link>
          <p className="footer-tagline">Tagline</p>
        </div>

        <div className="footer-section footer-links">
          <h3 className="footer-heading">Quick Links</h3>
          <ul>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/store">Store</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/checkout">Checkout</Link></li>
          </ul>
        </div>

        <div className="footer-section footer-contact">
          <h3 className="footer-heading">Get in Touch</h3>
          <p>Email: <a href="mailto:info@illuminade.com">iluminadeswiftproton.me@proton.me</a></p>
          <p>Location: Boston, MA</p>
        </div>

        <div className="footer-section footer-social">
          <h3 className="footer-heading">Follow Me</h3>
          <div className="social-links">
            <a href="https://www.tiktok.com/@iluminade11" target="_blank" rel="noopener noreferrer">TikTok</a>
            <a href="https://instagram.com/iluminade11" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Illuminade. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;