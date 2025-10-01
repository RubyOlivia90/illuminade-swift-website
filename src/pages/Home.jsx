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

        const firstEntry = response.data?.data?.[0];
        if (firstEntry) {
          setContent(firstEntry.attributes); 
        } else {
          setError('No homepage content found or published in Strapi.');
        }
      } catch (e) {
        console.error(e);
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

  // THIS IS THE FIX: REMOVED THE STRAPI_API_URL PREFIX
  const heroImageUrl = content.HeroImage?.data?.[0]?.attributes?.formats?.large?.url || '';

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
        style={{ marginTop: '2rem', textAlign: 'center' }} // Added inline style to center text
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