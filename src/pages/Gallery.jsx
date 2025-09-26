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

      try {
        const [itemsResp, textResp] = await Promise.all([
          axios.get(`${STRAPI_API_URL}/api/gallery-items?populate=*`),
          // FIX: Changed 'gallery-texts' to the plural 'gallery-texts'
          axios.get(`${STRAPI_API_URL}/api/gallery-texts?populate=*`)
        ]);

        const formattedItems =
          itemsResp.data?.data?.map(item => {
            const attrs = item.attributes || {};

            // ✅ Handle Strapi v4/v5 image format
            let imageUrl =
              'https://placehold.co/600x400/CCCCCC/333333?text=No+Image';
            const imgData = attrs.Image?.data;

            if (imgData) {
              if (Array.isArray(imgData) && imgData.length > 0) {
                imageUrl = imgData[0].attributes?.url || imageUrl;
              } else if (imgData.attributes?.url) {
                imageUrl = imgData.attributes.url;
              }
              if (!imageUrl.startsWith('http')) {
                imageUrl = `${STRAPI_API_URL}${imageUrl}`;
              }
            }

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

        // ✅ Handle text content
        const firstText = textResp.data?.data?.[0]?.attributes;
        if (firstText) {
          setPageContent({
            title: firstText.Title || 'My Gallery',
            body: firstText.Body || 'Add your gallery page description in Strapi.',
          });
        }
      } catch (err) {
        console.error(
          'Gallery fetch error:',
          err.response?.data || err.message
        );
        setError('Failed to load gallery content. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [STRAPI_API_URL]);

  if (loading) return <p>Loading gallery content...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="gallery-page-container">
      {/* Gallery Page Title & Body */}
      {pageContent && (
        <section className="gallery-header">
          <h1 className="gallery-title">{pageContent.title}</h1>
          <div className="gallery-body">
            <ReactMarkdown>{pageContent.body}</ReactMarkdown>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
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
      </section>
    </div>
  );
}

export default Gallery;