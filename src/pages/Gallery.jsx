import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../CartContext';
import ReactMarkdown from 'react-markdown';

function Gallery() {
  const [pageContent, setPageContent] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL || '';

  useEffect(() => {
    if (!STRAPI_API_URL) {
      setError('API URL not configured.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      let fetchError = null;

      try {
        const itemsResp = await axios.get(`${STRAPI_API_URL}/api/gallery-items?populate=*`);
        
        const formattedItems =
          itemsResp.data?.data?.map(item => {
            const attrs = item.attributes || {};
            // Correctly access the image URL from a single media field
            const imageUrl = attrs.Image?.data?.attributes?.url || 'https://placehold.co/600x400/CCCCCC/333333?text=No+Image';

            return {
              id: item.id,
              title: attrs.Title || 'Untitled Photo',
              description: attrs.Description || 'No description provided.',
              price:
                attrs.Price != null
                  ? parseFloat(attrs.Price).toFixed(2)
                  : 'N/A',
              stripeProductId: attrs.StripeProductID || 'N/A',
              imageUrl,
            };
          }) || [];

        setGalleryItems(formattedItems);

      } catch (err) {
        console.error('Gallery Items fetch failed:', err.response?.data || err.message);
        fetchError = 'Failed to load gallery items.';
      }

      try {
        const textResp = await axios.get(`${STRAPI_API_URL}/api/gallery-texts?populate=*`);
        const firstText = textResp.data?.data?.[0]?.attributes; 
        if (firstText) {
          setPageContent({
            title: firstText.Title || 'My Gallery',
            body: firstText.Body || 'Add your gallery page description in Strapi.',
          });
        }
      } catch (err) {
        console.error('Gallery Text fetch failed:', err.response?.data || err.message);
        if (!fetchError) fetchError = 'Failed to load gallery header text.';
      }

      setLoading(false);
      if (fetchError) setError(fetchError);
    };

    fetchData();
  }, [STRAPI_API_URL]);

  if (loading) return <p>Loading gallery content...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="gallery-page-container">
      {pageContent && (
        <section className="gallery-header">
          <h1 className="gallery-title">{pageContent.title}</h1>
          <div className="gallery-body">
            <ReactMarkdown>{pageContent.body}</ReactMarkdown>
          </div>
        </section>
      )}

      <section className="gallery-grid">
        {galleryItems.map(item => (
          <div className="gallery-card" key={item.id}>
            <img src={item.imageUrl} alt={item.title} />
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            {item.price !== 'N/A' && <p className="price">${item.price}</p>}
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ))}
        
        {galleryItems.length === 0 && !loading && !error && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#ccc' }}>
                No gallery items found. Please add content in Strapi.
            </p>
        )}
      </section>
    </div>
  );
}

export default Gallery;