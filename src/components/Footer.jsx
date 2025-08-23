// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

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

    
      <style>
        {`
          .footer {
            background-color: #1a1a1a;
            color: #f0f0f0;
            padding: 1.5rem 1rem;
            font-family: 'Quicksand', sans-serif;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
            margin-top: auto;
          }

          .footer-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1rem;
            max-width: 1280px;
            margin: 0 auto;
          }

          @media (max-width: 768px) {
            .footer-container {
              grid-template-columns: 1fr;
              text-align: center;
              gap: 0.5rem;
            }
            .footer-section {
              margin-bottom: 1rem;
            }
          }

          .footer-brand {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .footer-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.5rem;
            font-weight: bold;
            color: #a8e6cf;
            text-decoration: none;
            margin-bottom: 0.3rem;
          }

          .footer-tagline {
            font-size: 0.8rem;
            color: #a5a5a5;
          }

          .footer-heading {
            font-size: 1rem;
            font-weight: bold;
            color: #a8e6cf;
            margin-bottom: 0.2rem; /* Reduced margin */
            font-family: 'Cormorant Garamond', serif;
          }

          .footer-links {
            display: flex;
            flex-direction: column;
          }

          .footer-links ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .footer-links li {
            margin-bottom: 0.3rem;
          }

          .footer-links a,
          .footer-contact p,
          .footer-contact a {
            color: #f0f0f0;
            text-decoration: none;
            font-size: 0.8rem;
            transition: color 0.2s ease;
          }

          .footer-links a:hover,
          .footer-contact a:hover {
            color: #a8e6cf;
          }

          .social-links { /* ADDED/MODIFIED STYLES HERE for vertical layout */
            display: flex;
            flex-direction: column;
          }

          .social-links a {
            color: #f0f0f0;
            text-decoration: none;
            margin-bottom: 0.3rem; /* Changed from margin-right to margin-bottom */
            margin-right: 0; /* Ensure no horizontal margin remains */
            font-size: 0.8rem;
            transition: color 0.2s ease;
          }

          .social-links a:last-child {
            margin-bottom: 0; /* Remove margin from the last link */
          }

          .social-links a:hover {
            color: #a8e6cf;
          }

          .footer-bottom {
            text-align: center;
            padding-top: 1rem;
            margin-top: 1rem;
            border-top: 1px solid #333;
            font-size: 0.75rem;
            color: #a5a5a5;
          }

          @media (max-width: 480px) {
            .footer-title {
              font-size: 1.3rem;
            }
            .footer-heading {
              font-size: 0.9rem;
            }
            .footer-links a,
            .footer-contact p,
            .footer-contact a,
            .social-links a,
            .footer-tagline {
              font-size: 0.75rem;
            }
            .footer-bottom {
              font-size: 0.7rem;
            }
            .footer {
              padding: 1rem 0.8rem;
            }
            .footer-container {
              gap: 0.8rem;
            }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;