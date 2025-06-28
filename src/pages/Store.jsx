import React, { useState, useEffect } from 'react';
import axios from 'axios';

// IMPORTANT: Replace with your actual Strapi API URL (e.g., 'http://localhost:1337')
const STRAPI_API_URL = 'http://localhost:1337'; 

// Strapi Collection/Single Type names for the Store
const PRODUCTS_COLLECTION = 'products'; // API Key for your products
const STORE_TEXTS_COLLECTION = 'store-texts'; // API Key for your store page text

function Store() {
  const [products, setProducts] = useState([]);
  const [storePageContent, setStorePageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // --- Fetch Products (Individual Items) ---
        const productsApiUrl = `${STRAPI_API_URL}/api/${PRODUCTS_COLLECTION}?populate=*`;
        console.log(`Attempting to fetch products from: ${productsApiUrl}`);
        const productsResponse = await axios.get(productsApiUrl); 
        
        console.log("Raw response for Products API:", productsResponse.data);

        if (productsResponse.data && Array.isArray(productsResponse.data.data)) {
          const formattedProducts = productsResponse.data.data.map(item => {
            let processedItem = {
                id: item.id,
                title: 'Untitled Product (Fallback)', 
                description: 'No description provided (Fallback).',
                price: 'N/A', 
                stripeProductId: 'N/A',
                imageUrl: 'https://placehold.co/600x400/FF0000/FFFFFF?text=No+Product+Image' // Default fallback image
            };
            
            try {
                // Strapi v4+ usually wraps attributes, but we'll use item directly if not present
                const sourceData = item.attributes || item; 

                console.log("--- Processing Product Item ---");
                console.log("Processing raw product item (full object):", item); 
                console.log("Source data for product properties (Title, Description, Price, StripeProductID, ProductImage):", sourceData); 
                console.log("All top-level keys in sourceData:", Object.keys(sourceData)); 

                // Access Title
                processedItem.title = sourceData.Title || sourceData.title || 'Untitled Product'; 
                
                // Handle Description (Rich Text)
                if (Array.isArray(sourceData.Description) && sourceData.Description.length > 0) {
                    processedItem.description = sourceData.Description
                        .map(block => {
                            if (block.type === 'paragraph' && Array.isArray(block.children)) {
                                return block.children.map(child => child.text).join(''); 
                            }
                            return ''; 
                        })
                        .filter(Boolean) 
                        .join('\n'); 
                } else {
                    processedItem.description = sourceData.Description || sourceData.description || 'No description provided.';
                }

                // Handle Price
                if (sourceData.Price !== undefined && sourceData.Price !== null) {
                    processedItem.price = parseFloat(sourceData.Price).toFixed(2);
                } else if (sourceData.price !== undefined && sourceData.price !== null) { // Check lowercase 'price'
                    processedItem.price = parseFloat(sourceData.price).toFixed(2);
                } else {
                    console.warn("Price field not found or is null/undefined for product:", item.id);
                }

                // Handle StripeProductID
                processedItem.stripeProductId = sourceData.StripeProductID || sourceData.stripeProductId || 'N/A';


                // --- ProductImage URL parsing ---
                // CRITICAL FIX: Handle ProductImage being an array
                console.log("Raw sourceData.ProductImage object:", sourceData.ProductImage); 
                
                let foundImageUrl = false;
                let productImageData = sourceData.ProductImage;

                // If ProductImage is an array, take the first element
                if (Array.isArray(productImageData) && productImageData.length > 0) {
                    productImageData = productImageData[0];
                    console.log("ProductImage is an array, taking first element:", productImageData);
                }

                // Attempt 1: Standard Strapi v4/v5 nested structure: ProductImage.data.attributes.url
                if (productImageData && productImageData.data) {
                    if (productImageData.data.attributes && productImageData.data.attributes.url) {
                        processedItem.imageUrl = `${STRAPI_API_URL}${productImageData.data.attributes.url}`;
                        console.log("Product Image found: Standard nested path (ProductImage.data.attributes.url)", processedItem.imageUrl);
                        foundImageUrl = true;
                    }
                } 
                // Attempt 2: Direct URL on the ProductImage object itself
                if (!foundImageUrl && productImageData && typeof productImageData === 'object' && productImageData.url) { 
                    processedItem.imageUrl = `${STRAPI_API_URL}${productImageData.url}`;
                    console.log("Product Image found: Direct URL on ProductImage object (ProductImage.url)", processedItem.imageUrl);
                    foundImageUrl = true;
                }
                
                // Final fallback if no image URL was found
                if (!foundImageUrl) {
                    console.warn("Could not find product image URL after all attempts for item:", item);
                    processedItem.imageUrl = 'https://placehold.co/600x400/CCCCCC/333333?text=No+Product+Image'; 
                }

                console.log("Processed product object for rendering:", processedItem);

            } catch (parseError) {
                console.error("Error parsing product item:", item, parseError);
                processedItem.title = `Error parsing item ${item.id}`; 
                processedItem.description = 'Check console for details on this item.';
                processedItem.imageUrl = 'https://placehold.co/600x400/FF0000/FFFFFF?text=Parsing+Error';
                processedItem.price = 'Error';
            }
            return processedItem;
          });
          
          setProducts(formattedProducts);
        } else {
          console.error("Strapi response for products did not contain an array in 'data' field or was empty:", productsResponse.data);
          setError('No product entries found or published in Strapi, or unexpected data format from API.');
        }

        // --- Fetch Store Page Text (Collection Type, taking the first entry) ---
        const textApiUrl = `${STRAPI_API_URL}/api/${STORE_TEXTS_COLLECTION}?populate=*`;
        console.log(`Attempting to fetch store page text from: ${textApiUrl}`);
        const textResponse = await axios.get(textApiUrl);

        console.log("Raw response for Store Text API:", textResponse.data);

        // MODIFIED: Access the first element of the data.data array
        if (textResponse.data && Array.isArray(textResponse.data.data) && textResponse.data.data.length > 0) { 
          const pageContentEntry = textResponse.data.data[0]; 
          
          console.log("Store Text pageContentEntry (first item from array):", pageContentEntry);
          console.log("Store Text pageContentEntry.attributes:", pageContentEntry.attributes); // Should now be undefined based on your logs
          // NEW CONSOLE LOGS for direct access
          console.log("Store Text pageContentEntry.Title (direct):", pageContentEntry.Title);
          console.log("Store Text pageContentEntry.Body (direct):", pageContentEntry.Body);


          let pageTitle = 'Our Store';
          let pageBody = 'Welcome to our store. Find unique items here!';

          // CRITICAL FIX: Prioritize direct access, then check attributes (though direct should now work)
          if (pageContentEntry.Title) { // Direct capitalized 'Title'
              pageTitle = pageContentEntry.Title;
          } else if (pageContentEntry.title) { // Direct lowercase 'title'
              pageTitle = pageContentEntry.title;
          } else if (pageContentEntry.attributes && pageContentEntry.attributes.Title) { // Nested capitalized 'Title'
              pageTitle = pageContentEntry.attributes.Title;
          } else if (pageContentEntry.attributes && pageContentEntry.attributes.title) { // Nested lowercase 'title'
              pageTitle = pageContentEntry.attributes.title;
          }

          const rawBody = pageContentEntry.Body || pageContentEntry.body || // Direct capitalized/lowercase
                          (pageContentEntry.attributes && pageContentEntry.attributes.Body) || // Nested capitalized
                          (pageContentEntry.attributes && pageContentEntry.attributes.body); // Nested lowercase

          if (Array.isArray(rawBody) && rawBody.length > 0) {
              pageBody = rawBody
                  .map(block => {
                      if (block.type === 'paragraph' && Array.isArray(block.children)) {
                          return block.children.map(child => child.text).join(''); 
                      }
                      return ''; 
                  })
                  .filter(Boolean) 
                  .join('\n'); 
          } else if (typeof rawBody === 'string') {
              pageBody = rawBody; 
          }

          setStorePageContent({ title: pageTitle, body: pageBody });
          console.log("Store Page Content loaded successfully:", { title: pageTitle, body: pageBody });
        } else {
          console.warn("No store page content found from Strapi (empty data.data array for Collection Type):", textResponse.data);
          setStorePageContent({ title: 'Our Store', body: 'Welcome to our store. Find unique items here!' });
        }

      } catch (e) {
        console.error("Error fetching data in catch block:", e);
        if (axios.isAxiosError(e)) { 
          if (e.response) {
            setError(`Failed to load content: Server Error ${e.response.status} - ${e.response.statusText}. Response: ${JSON.stringify(e.response.data)}`);
            console.error('Full Axios error response:', e.response);
          } else if (e.request) {
            setError('Failed to load content: No response from server. Is Strapi running? Or is there a CORS issue?');
          } else {
            setError(`Failed to load content: ${e.message}`);
          }
        } else {
          setError(`Failed to load content: ${e.message || 'Unknown error.'}. Check browser console for more details.`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  if (loading) {
    return (
      <div className="store-loading-error-container loading-state">
        Loading store...
      </div>
    );
  }

  if (error) {
    return (
      <div className="store-loading-error-container error-state">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="store-container">
      {/* Display Store Page Title and Body */}
      {storePageContent ? (
        <>
          <h1 className="store-title">
            {storePageContent.title}
          </h1>
          <p className="store-page-body" style={{ whiteSpace: 'pre-line' }}>
            {storePageContent.body}
          </p>
        </>
      ) : (
        // Fallback for page content if it's not loaded yet
        <>
          <h1 className="store-title">Our Store</h1>
          <p className="store-page-body" style={{ whiteSpace: 'pre-line' }}>Loading page description...</p>
        </>
      )}
      
      {/* Display Products */}
      {products.length === 0 ? (
        <p className="store-empty-message">No products found in the store. Please add some in Strapi!</p>
      ) : (
        <div className="store-grid">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="store-card"
            >
              <div className="store-image-wrapper">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="store-image"
                />
              </div>
              <h2 className="store-card-title">
                {product.title}
              </h2>
              <p className="store-card-description" style={{ whiteSpace: 'pre-line' }}>
                {product.description}
              </p>
              <div className="store-card-price">
                {product.price !== 'N/A' ? `$${product.price}` : 'Price: N/A'}
              </div>
              <button className="store-add-to-cart-button">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Internal CSS for the Store component */}
      <style>
        {`
          /* Basic container for loading/error messages */
          .store-loading-error-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-size: 1rem;
            font-family: 'Helvetica Neue', sans-serif;
          }

          .loading-state {
            background-color: #f3f4f6;
            color: #4b5563;
          }

          .error-state {
            background-color: #fee2e2;
            color: #b91c1c;
          }

          .store-container {
            width: 90%; 
            max-width: 1280px; 
            margin: 0 auto; 
            padding: 1.5rem 1rem; 
            padding-top: 5rem; 
            padding-bottom: 2rem;
            box-sizing: border-box; 
            font-family: 'Helvetica Neue', sans-serif;
          }

          @media (min-width: 768px) {
            .store-container {
              padding: 2rem;
              padding-top: 6rem;
            }
          }

          .store-title {
            font-size: 2.8rem; 
            font-weight: 800;
            text-align: center;
            margin-bottom: 0.8rem; 
            color: #f0f0f0;
            font-family: 'Cormorant Garamond', serif;
          }

          .store-page-body {
            text-align: center;
            color: #f0f0f0;
            font-size: 1rem; 
            margin-bottom: 2.5rem; 
            max-width: 700px; 
            margin-left: auto;
            margin-right: auto;
            font-family: 'Quicksand', sans-serif;
            line-height: 1.6;
          }

          .store-empty-message {
            text-align: center;
            color: #f0f0f0;
            font-size: 1.1rem;
            font-family: 'Quicksand', sans-serif;
          }

          .store-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
            gap: 1.5rem; 
          }

          @media (min-width: 640px) { 
            .store-grid {
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
            }
          }

          @media (min-width: 768px) { 
            .store-grid {
              grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
            }
          }

          @media (min-width: 1024px) { 
            .store-grid {
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            }
          }

          .store-card {
            background-color: #ffffff;
            padding: 0.9rem; 
            border-radius: 0.8rem; 
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); 
            transition: all 0.3s ease-in-out; 
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: center;
          }

          .store-card:hover {
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); 
            transform: translateY(-0.15rem); 
          }

          .store-image-wrapper {
            overflow: hidden; 
            border-radius: 0.6rem; 
            margin-bottom: 0.8rem; 
            width: 100%; 
            padding-top: 60%; 
            position: relative; 
            background-color: #f0f0f0; 
          }

          .store-image {
            position: absolute; 
            top: 0;
            left: 0;
            width: 100%;
            height: 100%; 
            object-fit: contain; 
            border-radius: 0.6rem;
            transition: transform 0.3s ease-in-out; 
          }

          .store-card:hover .store-image {
            transform: scale(1.02); 
          }

          .store-card-title {
            font-size: 1.2rem; 
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 0.3rem; 
            font-family: 'Cormorant Garamond', serif;
          }

          .store-card-description {
            color: #4b5563;
            font-size: 0.8rem; 
            flex-grow: 1;
            margin-bottom: 0.8rem;
            font-family: 'Quicksand', sans-serif;
            white-space: pre-line;
            word-break: break-word; 
            overflow-wrap: break-word; 
          }
          
          .store-card-price {
            font-size: 1.3rem; 
            font-weight: bold;
            color: #064420;
            margin-bottom: 1rem; 
            font-family: 'Helvetica Neue', sans-serif;
          }

          .store-add-to-cart-button {
            padding: 0.4rem 0.8rem; 
            background-color: #a8e6cf;
            border: none;
            font-weight: 700;
            cursor: pointer;
            border-radius: 6px; 
            color: #064420;
            transition: background-color 0.2s ease;
            width: 100%;
            margin-top: auto;
            font-size: 0.85rem; 
          }

          .store-add-to-cart-button:hover {
            background-color: #82c9a8;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .store-container {
              padding: 1rem;
              padding-top: 4rem; 
              width: 95%; 
            }

            .store-title {
              font-size: 2.2rem;
            }
            .store-page-body {
              font-size: 0.9rem;
              margin-bottom: 1.5rem;
            }
            .store-grid {
              gap: 1rem;
              grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); 
            }
            .store-card {
              padding: 0.7rem;
            }
            .store-image-wrapper {
              padding-top: 65%; 
            }
          }
        `}
      </style>
    </div>
  );
}

export default Store;