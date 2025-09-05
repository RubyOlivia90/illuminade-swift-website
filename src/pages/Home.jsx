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
      setError('API URL not configured. Check environment variables.');
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      setLoading(true);
      setError(null);

      try {
        // IMPORTANT: populate=* fetches all nested fields like media
        const response = await axios.get(`${STRAPI_API_URL}/api/home-page-contents?populate=*`);

        const firstEntry = response.data?.data?.[0];
        if (firstEntry) {
          setContent(firstEntry.attributes);
        } else {
          setError('No homepage content found or published in Strapi.');
        }
      } catch (e) {
        console.error(e);
        if (e.response) {
          setError(`Server Error ${e.response.status}: ${e.response.statusText}`);
        } else if (e.request) {
          setError('No response from server. Is Strapi running and public API accessible?');
        } else {
          setError(`Error: ${e.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [STRAPI_API_URL]);

  if (loading) return <p>Loading homepage content...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!content) return <p>No homepage content found.</p>;

  // Hero Image URL
  const heroImageUrl = content.HeroImage?.data?.attributes?.url
    ? content.HeroImage.data.attributes.url.startsWith('http')
      ? content.HeroImage.data.attributes.url
      : `${STRAPI_API_URL}${content.HeroImage.data.attributes.url}`
    : '';

  // Helper to render HeroText (assuming it's a JSON structure)
  const renderHeroText = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) return null;
    return blocks.map((block, idx) => {
      if (block.type === 'paragraph') {
        return (
          <p key={idx}>
            {block.children.map((child, cidx) => {
              if (child.type === 'text') return child.text;
              if (child.type === 'link') return <a key={cidx} href={child.url}>{child.children[0]?.text}</a>;
              return null;
            })}
          </p>
        );
      }
      return null;
    });
  };

  return (
    <div className="home-page-wrapper">
      {/* Hero Section */}
      <header
        className="hero-header"
        style={{ backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : 'none' }}
      >
        <div className="overlay">
          <h1 className="hero-title">{content.Title || 'Your Site Title'}</h1>
          <div className="hero-subtitle">{renderHeroText(content.HeroText)}</div>
        </div>
      </header>

      {/* About Section */}
      <section className="home-container about-section" style={{ marginTop: '2rem' }}>
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
