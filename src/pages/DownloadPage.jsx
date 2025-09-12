import React from 'react';
import { useLocation } from 'react-router-dom';

const DownloadPage = () => {
  const location = useLocation();
  const { imageUrl, title } = location.state || {};

  if (!imageUrl) {
    return (
      <div className="download-page-container" style={{ textAlign: 'center', marginTop: '5rem', color: '#f5f5f5' }}>
        <h2>Invalid Download Link</h2>
        <p>Please return to the store or contact support.</p>
      </div>
    );
  }

  return (
    <div className="download-page-container" style={{ textAlign: 'center', marginTop: '5rem', color: '#f5f5f5' }}>
      <h2>Thank you for your purchase!</h2>
      <p>Your download is ready. Click the button below to save your file.</p>
      <a href={imageUrl} download={title} style={downloadButtonStyles}>
        Download {title}
      </a>
    </div>
  );
};

const downloadButtonStyles = {
  display: 'inline-block',
  padding: '1rem 2rem',
  backgroundColor: '#a8e6cf',
  color: '#1a1a1a',
  textDecoration: 'none',
  fontWeight: 'bold',
  borderRadius: '5px',
  marginTop: '2rem',
  fontSize: '1rem'
};

export default DownloadPage;