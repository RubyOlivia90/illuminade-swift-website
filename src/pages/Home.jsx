import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function Home() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_ENDPOINT = 'VITE_STRAPI_API_URL=https://methodical-chicken-e88556b464.strapiapp.com/admin';

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(API_ENDPOINT);

        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const firstEntry = response.data.data[0];
          if (firstEntry) {
            setContent(firstEntry);
          } else {
            setError('First content entry was empty.');
          }
        } else {
          setError('No homepage content entries found or published in Strapi.');
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
  }, [API_ENDPOINT]);

  // Helper to render HeroText (simplified) - No change needed here
  function renderHeroText(heroText) {
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
  }

  if (loading) return <p>Loading homepage content...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!content) return <p>No homepage content found after loading. Check console for details.</p>;

  // Determine background image URL for hero-header (from Strapi)
  const heroImageUrl = content.HeroImage?.url ? `http://localhost:1337${content.HeroImage.url}` : '';

  return (
    <div className="home-page-wrapper">

      <header
        className="hero-header"
        // This style remains to use the dynamic HeroImage from Strapi
        style={{ backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : 'none' }}
      >
        <div className="overlay">
          <h1 className="hero-title">
            {content.Title || 'Your Site Title'}
          </h1>
          {/* Hero text goes here, under the title, inside the overlay */}
          <div className="hero-subtitle"> {/* Using hero-subtitle class for styling */}
            {renderHeroText(content.HeroText)}
          </div>
        </div>
      </header>

      {/* About Me Section - Removed 'yellow-box' class */}
      <div className="home-container about-section" style={{ marginTop: '2rem' }}>
        <h2>About Me</h2>
        <p style={{ whiteSpace: 'pre-line', maxWidth: '700px', margin: '0 auto' }}>
          {content.About || 'Add your about me content in Strapi.'}
        </p>
      </div>
    </div>
  );
}

export default Home;