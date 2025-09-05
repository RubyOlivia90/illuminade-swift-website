import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../CartContext';

const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL;
const PRODUCTS_COLLECTION = 'products';
const STORE_TEXTS_COLLECTION = 'store-texts';

function Store() {
  const [products, setProducts] = useState([]);
  const [storePageContent, setStorePageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const productsResponse = await axios.get(`${STRAPI_API_URL}/api/${PRODUCTS_COLLECTION}?populate=*`);
        const formattedProducts = productsResponse.data.data.map(item => {
          const sourceData = item.attributes || item;
          const description = Array.isArray(sourceData.Description)
            ? sourceData.Description.map(block => block.children.map(c => c.text).join('')).join('\n')
            : sourceData.Description || 'No description provided.';
          return {
            id: item.id,
            title: sourceData.Title || 'Untitled Product',
            description,
            price: sourceData.Price ? parseFloat(sourceData.Price).toFixed(2) : 'N/A',
            stripeProductId: sourceData.StripeProductID || 'N/A',
            imageUrl: sourceData.ProductImage?.data?.attributes?.url
              ? `${STRAPI_API_URL}${sourceData.ProductImage.data.attributes.url}`
              : 'https://placehold.co/600x400/CCCCCC/333333?text=No+Product+Image',
          };
        });
        setProducts(formattedProducts);

        const textResponse = await axios.get(`${STRAPI_API_URL}/api/${STORE_TEXTS_COLLECTION}?populate=*`);
        const firstText = textResponse.data.data[0];
        setStorePageContent({
          title: firstText?.Title || 'Our Store',
          body: firstText?.Body || 'Welcome to our store. Find unique items here!',
        });
      } catch (e) {
        setError('Failed to load store content. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading store...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="store-container">
      <h1>{storePageContent?.title}</h1>
      <p style={{ whiteSpace: 'pre-line' }}>{storePageContent?.body}</p>
      <div className="store-grid">
        {products.map(p => (
          <div key={p.id} className="store-card">
            <img src={p.imageUrl} alt={p.title} />
            <h2>{p.title}</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{p.description}</p>
            <div>{p.price !== 'N/A' ? `$${p.price}` : 'Price: N/A'}</div>
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Store;
