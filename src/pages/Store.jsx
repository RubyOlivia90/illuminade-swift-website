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
  }, [STRAPI_API_URL]);

  if (loading) return <div>Loading store...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="store-page-container">
      {pageContent && (
        <>
          <h1 className="store-title">{pageContent.title}</h1>
          <ReactMarkdown className="store-body">
            {pageContent.body}
          </ReactMarkdown>
        </>
      )}

      <div className="store-grid">
        {products.map(product => (
          <div key={product.id} className="store-card">
            <div className="store-card-image-wrapper">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="store-card-image"
              />
            </div>
            <h2>{product.title}</h2>
            <p className="store-card-description">{product.description}</p>
            <div className="store-card-price">
              {product.price !== 'N/A' ? `$${product.price}` : 'Price: N/A'}
            </div>
            <button className="store-card-button" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}