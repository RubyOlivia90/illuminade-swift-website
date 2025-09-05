import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../CartContext';
import ReactMarkdown from 'react-markdown';

// Strapi collection slugs
const GALLERY_ITEMS_COLLECTION = 'gallery-items';
const GALLERY_TEXTS_COLLECTION = 'gallery-texts';

// Base API URL from environment
const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL || '';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!STRAPI_API_URL) {
      setError('API URL not configured. Check environment variables.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch gallery items
        const itemsResponse = await axios.get(
          `${STRAPI_API_URL}/api/${GALLERY_ITEMS_COLLECTION}?populate=*`
        );
        const textsResponse = await axios.get(
          `${STRAPI_API_URL}/api/${GALLERY_TEXTS_COLLECTION}?populate=*`
        );

        // Process items
        if (Array.isArray(itemsResponse.data?.data)) {
          const formattedPhotos = itemsResponse.data.data.map(item => {
            const attrs = item.attributes || {};
            let imageUrl = attrs.Image?.data?.attributes?.url || '';
            if (imageUrl && !imageUrl.startsWith('http')) {
              imageUrl = `${STRAPI_API_URL}${imageUrl}`;
            }
            return {
              id: item.id,
              title: attrs.Title || 'Untitled Photo',
              description: attrs.Description || 'No description provided.',
              imageUrl: imageUrl || 'https://placehold.co/600x400/CCCCCC/333333?text=No+Image+Found',
              price: attrs.Price != null ? parseFloat(attrs.Price).toFixed(2) : 'N/A',
              stripeProductId: attrs.StripeProductID || 'N/A',
            };
          });
          setPhotos(formattedPhotos);
        } else {
          setError('No gallery items found or published.');
        }

        // Process page content
        const firstText = textsResponse.data?.data?.[0]?.attributes || {};
        setPageContent({
          title: firstText.Title || 'Our Gallery',
          body: firstText.Body || 'Add page description in Strapi.',
        });
      } catch (err) {
        console.error('Error fetching gallery data:', err);
        setError('Failed to load gallery content. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading gallery...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1280px', margin: 'auto' }}>
      {/* Page Title & Body */}
      {pageContent && (
        <>
          <h1 style={{ textAlign: 'center' }}>{pageContent.title}</h1>
          <ReactMarkdown style={{ textAlign: 'center' }}>{pageContent.body}</ReactMarkdown>
        </>
      )}

      {/* Gallery Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem',
        }}
      >
        {photos.map(photo => (
          <div
            key={photo.id}
            style={{
              backgroundColor: '#FFCCFF',
              padding: '1rem',
              borderRadius: '0.8rem',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                overflow: 'hidden',
                borderRadius: '0.6rem',
                height: '250px',
                marginBottom: '0.8rem',
                position: 'relative',
                backgroundColor: '#f0f0f0',
              }}
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h2>{photo.title}</h2>
            <p style={{ color: '#757575', fontSize: '0.85rem', minHeight: '3em' }}>
              {photo.description}
            </p>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {photo.price !== 'N/A' ? `$${photo.price}` : 'Price: N/A'}
            </div>
            <button
              onClick={() => addToCart(photo)}
              style={{
                padding: '0.4rem 0.8rem',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#fff',
                cursor: 'pointer',
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
