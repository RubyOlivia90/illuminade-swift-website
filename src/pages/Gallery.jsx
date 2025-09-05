import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../CartContext';
import ReactMarkdown from 'react-markdown';

// Collection slugs (must match Strapi exactly)
const GALLERY_ITEMS_COLLECTION = 'gallery-items';
const GALLERY_TEXTS_COLLECTION = 'gallery-texts';

// Base Strapi API URL from Vite env variable
const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL || '';

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [galleryPageContent, setGalleryPageContent] = useState(null);
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
        const itemsApiUrl = `${STRAPI_API_URL}/api/${GALLERY_ITEMS_COLLECTION}?populate=*`;
        const textsApiUrl = `${STRAPI_API_URL}/api/${GALLERY_TEXTS_COLLECTION}?populate=*`;

        // Fetch gallery items
        const itemsResponse = await axios.get(itemsApiUrl);
        if (itemsResponse.data?.data && Array.isArray(itemsResponse.data.data)) {
          const formattedPhotos = itemsResponse.data.data.map(item => {
            const attrs = item.attributes || {};
            let imageUrl = attrs.Image?.data?.attributes?.url || '';
            // Prepend STRAPI_API_URL if relative path
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

        // Fetch gallery page content
        const textResponse = await axios.get(textsApiUrl);
        if (textResponse.data?.data?.length > 0) {
          const attrs = textResponse.data.data[0].attributes || {};
          setGalleryPageContent({
            title: attrs.Title || 'Our Gallery',
            body: attrs.Body || 'Add page description in Strapi.',
          });
        } else {
          setGalleryPageContent({ title: 'Our Gallery', body: 'Add page description in Strapi.' });
        }

      } catch (e) {
        console.error('Error fetching gallery data:', e);
        setError('Failed to load gallery content. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="gallery-loading-error-container loading-state">Loading gallery...</div>;
  if (error) return <div className="gallery-loading-error-container error-state">Error: {error}</div>;

  return (
    <div className="gallery-container" style={{
      paddingTop: '7rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '1280px',
      margin: 'auto',
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
      paddingBottom: '2rem',
      boxSizing: 'border-box'
    }}>
      {/* Page Title & Body */}
      {galleryPageContent && (
        <>
          <h1 className="gallery-title" style={{ textAlign: 'center' }}>{galleryPageContent.title}</h1>
          <ReactMarkdown className="gallery-page-body" style={{ whiteSpace: 'pre-line', textAlign: 'center' }}>
            {galleryPageContent.body}
          </ReactMarkdown>
        </>
      )}

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#f0f0f0', fontSize: '1.1rem' }}>No photos found in the gallery. Please add some in Strapi!</p>
      ) : (
        <div className="gallery-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          width: '100%',
          marginTop: '2rem'
        }}>
          {photos.map(photo => (
            <div key={photo.id} className="gallery-card" style={{
              backgroundColor: '#FFCCFF',
              padding: '0.9rem',
              borderRadius: '0.8rem',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center'
            }}>
              <div style={{ overflow: 'hidden', borderRadius: '0.6rem', marginBottom: '0.8rem', width: '100%', height: '250px', position: 'relative', backgroundColor: '#f0f0f0' }}>
                <img src={photo.imageUrl} alt={photo.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.6rem' }} />
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.3rem' }}>{photo.title}</h2>
              <p style={{
                whiteSpace: 'pre-line',
                color: '#757575ff',
                fontSize: '0.8rem',
                flexGrow: 1,
                marginBottom: '0.8rem',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}>{photo.description}</p>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#000000ff', marginBottom: '1rem' }}>
                {photo.price !== 'N/A' ? `$${photo.price}` : 'Price: N/A'}
              </div>
              <button onClick={() => addToCart(photo)} style={{
                padding: '0.4rem 0.8rem',
                backgroundColor: '#ffffffff',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                borderRadius: '6px',
                color: '#000000ff',
                transition: 'background-color 0.2s ease',
                width: '100%',
                marginTop: 'auto',
                fontSize: '0.85rem'
              }}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;
