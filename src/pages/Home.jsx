import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function Home() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL || '';

  useEffect(() => {
    if (!STRAPI_API_URL) {
      setError('API URL not configured.');
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${STRAPI_API_URL}/api/home-page-contents?populate=*`);
        
        // This is the key fix: Use the data directly without accessing .attributes
        const homeContent = response.data?.data?.[0]?.attributes;
        
        if (homeContent) {
          setContent(homeContent);
        } else {
          setError('No homepage content found.');
        }
      } catch (e) {
        console.error("Error fetching homepage data:", e);
        setError('Failed to fetch content. See console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [STRAPI_API_URL]);

  if (loading) return <p>Loading homepage content...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!content) return <p>No homepage content found.</p>;

  // This correctly gets the direct URL from the populated HeroImage field
  const heroImageUrl = content.HeroImage?.data?.attributes?.url || '';

  return (
    <div className="home-page-wrapper">
      <header
        className="hero-header"
        style={{ backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : 'none' }}
      >
        <div className="overlay">
          <h1 className="hero-title">{content.Title || 'Your Site Title'}</h1>
          <div className="hero-subtitle">{content.HeroText}</div>
        </div>
      </header>

      <section 
        className="home-container about-section" 
        style={{ marginTop: '2rem', textAlign: 'center' }}
      >
        <h2>About Me</h2>
        {content.About ? (
          <ReactMarkdown style={{ whiteSpace: 'pre-line', maxWidth: '700px', margin: '0 auto' }}>
            {content.About}
          </ReactMarkdown>
        ) : (
          <p style={{ whiteSpace: 'pre-line', maxWidth: '700px', margin: '0 auto' }}>
            Add your about me content in Strapi.
          </p>
        )}
      </section>
    </div>
  );
}

export default Home;