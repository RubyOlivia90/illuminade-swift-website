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
        const response = await axios.get(`${STRAPI_API_URL}/api/home-page-contents`);

        const data = response.data?.data;

        let fetchedContent = null;

        // Handle single-type content
        if (!Array.isArray(data)) {
          fetchedContent = data?.attributes || null;
        } else if (Array.isArray(data) && data.length > 0) {
          // Handle collection-type content
          fetchedContent = data[0]?.attributes || null;
        }

        if (!fetchedContent) {
          setError('No homepage content found or published in Strapi.');
        } else {
          setContent(fetchedContent);
        }
      } catch (e) {
        if (e.response) {
          setError(`Failed to fetch content: Server Error ${e.response.status} - ${e.response.statusText}.`);
        } else if (e.request) {
          setError('Failed to fetch content: No response from server. Is Strapi running?');
        } else {
          setError(`Failed to fetch content: ${e.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [STRAPI_API_URL]);

  if (loading) return <p>Loading homepage content...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!content) return <p>No homepage content found after loading. Check console for details.</p>;

  // Helper to render HeroText (supports markdown if desired)
  const renderHeroText = (heroText) => {
    if (!heroText || !Array.isArray(heroText)) return null;
    return heroText.map((block, idx) => {
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

  // Determine hero image URL safely
  let heroImageUrl = '';
  if (content.HeroImage?.data?.attributes?.url) {
    heroImageUrl = content.HeroImage.data.attributes.url.startsWith('http')
      ? content.HeroImage.data.attributes.url
      : `${STRAPI_API_URL}${content.HeroImage.data.attributes.url}`;
  }

  return (
    <div className="home-page-wrapper">
      <header
        className="hero-header"
        style={{ backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : 'none' }}
      >
        <div className="overlay">
          <h1 className="hero-title">{content.Title || 'Your Site Title'}</h1>
          <div className="hero-subtitle">
            {renderHeroText(content.HeroText)}
          </div>
        </div>
      </header>

      {/* About Me Section */}
      <div className="home-container about-section" style={{ marginTop: '2rem' }}>
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
      </div>
    </div>
  );
}

export default Home;
