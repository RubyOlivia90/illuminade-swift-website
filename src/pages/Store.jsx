import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../CartContext';
import ReactMarkdown from 'react-markdown';

const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL;
const PRODUCTS_COLLECTION = 'products';
const STORE_TEXTS_COLLECTION = 'store-texts';

export default function Store() {
  const [products, setProducts] = useState([]);
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
        // Fetch products
        const productsResponse = await axios.get(`${STRAPI_API_URL}/api/${PRODUCTS_COLLECTION}?populate=*`);
        if (Array.isArray(productsResponse.data?.data)) {
          const formattedProducts = productsResponse.data.data.map(item => {
            const attrs = item.attributes || {};
            let description = '';
            if (Array.isArray(attrs.Description)) {
              description = attrs.Description.map(block =>
                block.children.map(c => c.text).join('')
              ).join('\n');
            } else {
              description = attrs.Description || 'No description provided.';
            }

            let imageUrl = attrs.ProductImage?.data?.attributes?.url || '';
            if (imageUrl && !imageUrl.startsWith('http')) {
              imageUrl = `${STRAPI_API_URL}${imageUrl}`;
            }

            return {
              id: item.id,
              title: attrs.Title || 'Untitled Product',
              description,
              price: attrs.Price != null ? parseFloat(attrs.Price).toFixed(2) : 'N/A',
              stripeProductId: attrs.StripeProductID || 'N/A',
              imageUrl: imageUrl || 'https://placehold.co/600x400/CCCCCC/333333?text=No+Product+Image',
            };
          });
          setProducts(formattedProducts);
        } else {
          setError('No products found or published.');
        }

        // Fetch store page content
        const textResponse = await axios.get(`${STRAPI_API_URL}/api/${STORE_TEXTS_COLLECTION}?populate=*`);
        const firstText = textResponse.data?.data?.[0]?.attributes || {};
        setPageContent({
          title: firstText.Title || 'Our Store',
          body: firstText.Body || 'Welcome to our store. Find unique items here!',
        });
      } catch (err) {
        console.error('Error fetching store data:', err);
        setError('Failed to load store content. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading store...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="store-container" style={{ padding: '2rem', maxWidth: '1280px', margin: 'auto' }}>
      {pageContent && (
        <>
          <h1 style={{ textAlign: 'center' }}>{pageContent.title}</h1>
          <ReactMarkdown style={{ textAlign: 'center', whiteSpace: 'pre-line' }}>
            {pageContent.body}
          </ReactMarkdown>
        </>
      )}

      <div
        className="store-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem',
        }}
      >
        {products.map(product => (
          <div
            key={product.id}
            className="store-card"
            style={{
              backgroundColor: '#FFEEFF',
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
                src={product.imageUrl}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h2>{product.title}</h2>
            <p style={{ whiteSpace: 'pre-line', color: '#757575', fontSize: '0.85rem', minHeight: '3em' }}>
              {product.description}
            </p>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {product.price !== 'N/A' ? `$${product.price}` : 'Price: N/A'}
            </div>
            <button
              onClick={() => addToCart(product)}
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
