import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useCart } from '../CartContext';
// import ReactMarkdown from 'react-markdown';

// const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL;
// const PRODUCTS_COLLECTION = 'products';
// const STORE_TEXTS_COLLECTION = 'store-texts';

export default function Store() {
  // const [products, setProducts] = useState([]);
  // const [pageContent, setPageContent] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const { addToCart } = useCart();

  // useEffect(() => {
  //   if (!STRAPI_API_URL) {
  //     setError('API URL not configured.');
  //     setLoading(false);
  //     return;
  //   }

  //   const fetchData = async () => {
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       // Fetch products
  //       const productsRes = await axios.get(
  //         `${STRAPI_API_URL}/api/${PRODUCTS_COLLECTION}?populate=*`
  //       );
  //       console.log('RAW products data:', productsRes.data);

  //       const formattedProducts = (productsRes.data.data || []).map(item => {
  //         const attrs = item.attributes || {};

  //         // Get image URL
  //         let imageUrl = attrs.ProductImage?.data?.attributes?.url || '';
  //         if (imageUrl && !imageUrl.startsWith('http')) {
  //           imageUrl = `${STRAPI_API_URL}${imageUrl}`;
  //         }

  //         return {
  //           id: item.id,
  //           title: attrs.Title || 'Untitled Product',
  //           description: attrs.Description || 'No description provided.',
  //           price:
  //             attrs.Price != null
  //               ? parseFloat(attrs.Price).toFixed(2)
  //               : 'N/A',
  //           stripeProductId: attrs.StripeProductID || 'N/A',
  //           imageUrl:
  //             imageUrl ||
  //             'https://placehold.co/600x400/CCCCCC/333333?text=No+Product+Image',
  //         };
  //       });

  //       setProducts(formattedProducts);

  //       // Fetch store texts
  //       const textsRes = await axios.get(
  //         `${STRAPI_API_URL}/api/${STORE_TEXTS_COLLECTION}?populate=*`
  //       );
  //       console.log('RAW store text data:', textsRes.data);

  //       const firstText = textsRes.data?.data?.[0]?.attributes || {};
  //       setPageContent({
  //         title: firstText.Title || 'Our Store',
  //         body: firstText.Body || 'Welcome to our store. Find unique items here!',
  //       });
  //     } catch (err) {
  //       console.error('Error fetching store data:', err);
  //       setError('Failed to load store content.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // if (loading) return <div>Loading store...</div>;
  // if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <h1>Coming Soon</h1>
    </div>
  );
}