import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../CartContext';
import ReactMarkdown from 'react-markdown';

function Gallery() {
  const [content, setContent] = useState(null); // page text content
  const [photos, setPhotos] = useState([]);     // gallery items
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL || '';
  const ITEMS_COLLECTION = 'gallery-items';
  const TEXT_COLLECTION = 'gallery-texts';

  useEffect(() => {
    if (!STRAPI_API_URL) {
      setError('API URL not configured.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch gallery items
        const itemsResp = await axios.get(`${STRAPI_API_URL}/api/${ITEMS_COLLECTION}?populate=*`);
        const textResp = await axios.get(`${STRAPI_API_URL}/api/${TEXT_COLLECTION}?populate=*`);

        // Format gallery items
        const formattedPhotos = itemsResp.data?.data?.map(item => {
          const attrs = item.attributes || {};
          const imgData = attrs.Image?.data?.attributes || {};
          const imageUrl = imgData.url ? (imgData.url.startsWith('http') ? imgData.url : `${STRAPI_API_URL}${imgData.url}`) : '';

          return {
            id: item.id,
            title: attrs.Title || 'Untitled Photo',
            description: attrs.Description || 'No description provided.',
            price: attrs.Price != null ? parseFloat(attrs.Price).toFixed(2) : 'N/A',
            stripeProductId: attrs.StripeProductID || 'N/A',
            imageUrl: imageUrl || 'https://placehold.co/600x400/CCCCCC/333333?text=No+Image',
          };
        }) || [];

        setPhotos(formattedPhotos);

        // Page text content
        const firstText = textResp.data?.data?.[0]?.attributes || {};
        setContent({
          title: firstText.Title || 'Our Gallery',
          body: firstText.Body || 'Add your gallery page description in Strapi.',
        });

      } catch (err) {
        console.error('Gallery fetch error:', err);
        setError('Failed to load gallery content. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [STRAPI_API_URL]);

  if (loading) return <p>Loading gallery content...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!content) return <p>No gallery content found.</p>;

  return (
    <div className="home-page-wrapper">
      {/* Page Title & Body */}
      <section className="home-container about-section">
        <h1 style={{ textAlign: 'center' }}>{content.title}</h1>
        <ReactMarkdown style={{ whiteSpace: 'pre-line', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          {content.body}
        </ReactMarkdown>
      </section>

      {/* Gallery Grid */}
      <section className="home-container home-photos">
        <div className="grid-container">
          {photos.map(photo => (
            <div className="card" key={photo.id}>
              {photo.imageUrl && (
                <div className="hero-header" style={{ backgroundImage: `url(${photo.imageUrl})`, height: '250px', borderRadius: '0.6rem', marginBottom: '0.8rem' }}></div>
              )}
              <h2>{photo.title}</h2>
              <p style={{ minHeight: '3em' }}>{photo.description}</p>
              {photo.price !== 'N/A' && <div className="price">${photo.price}</div>}
              <button onClick={() => addToCart(photo)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Gallery;
