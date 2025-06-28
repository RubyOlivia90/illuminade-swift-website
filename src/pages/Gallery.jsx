// After
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../CartContext'; // Import the useCart hook

// IMPORTANT: Replace with your actual Strapi API URL (e.g., 'http://localhost:1337')
const STRAPI_API_URL = 'http://localhost:1337'; 

// Strapi Collection/Single Type names
const GALLERY_ITEMS_COLLECTION = 'gallery-items'; 
const GALLERY_TEXTS_COLLECTION = 'gallery-texts'; 

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [galleryPageContent, setGalleryPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart(); // Get addToCart from cart context

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // --- Fetch Gallery Items (Individual Photos) ---
        const itemsApiUrl = `${STRAPI_API_URL}/api/${GALLERY_ITEMS_COLLECTION}?populate=*`;
        console.log(`Attempting to fetch gallery items from: ${itemsApiUrl}`);
        const itemsResponse = await axios.get(itemsApiUrl); 
        
        console.log("Raw response for Gallery Items API:", itemsResponse.data);

        if (itemsResponse.data && Array.isArray(itemsResponse.data.data)) {
          const formattedPhotos = itemsResponse.data.data.map(item => {
            let processedItem = {
                id: item.id,
                title: 'Untitled Photo (Fallback)', 
                description: 'No description provided (Fallback).',
                imageUrl: 'https://placehold.co/600x400/FF0000/FFFFFF?text=No+Image+Found', 
                price: 'N/A' 
            };
            
            try {
                const sourceData = item.attributes || item; 

                console.log("--- Processing Gallery Item ---");
                console.log("Processing raw item (full object):", item); 
                console.log("Source data for item properties (Title, Description, Image/Price):", sourceData); 
                console.log("All top-level keys in sourceData:", Object.keys(sourceData)); 

                processedItem.title = sourceData.Title || 'Untitled Photo'; 
                
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
                    processedItem.description = sourceData.Description || 'No description provided.';
                }

                if (sourceData.Price !== undefined && sourceData.Price !== null) {
                    processedItem.price = parseFloat(sourceData.Price).toFixed(2);
                } else {
                    console.warn("Price field not found or is null/undefined for item:", item.id);
                }

                console.log("Raw sourceData.Image object:", sourceData.Image); 
                
                let foundImageUrl = false;
                if (sourceData.Image && sourceData.Image.data) {
                    if (!Array.isArray(sourceData.Image.data)) { 
                        if (sourceData.Image.data.attributes && sourceData.Image.data.attributes.url) {
                            processedItem.imageUrl = `${STRAPI_API_URL}${sourceData.Image.data.attributes.url}`;
                            console.log("Image found: Standard nested path (Image.data.attributes.url)", processedItem.imageUrl);
                            foundImageUrl = true;
                        }
                    } else if (Array.isArray(sourceData.Image.data) && sourceData.Image.data.length > 0 && 
                               sourceData.Image.data[0].attributes && 
                               sourceData.Image.data[0].attributes.url) { 
                        processedItem.imageUrl = `${STRAPI_API_URL}${sourceData.Image.data[0].attributes.url}`;
                        console.log("Image found: Standard nested path (Image.data[0].attributes.url)", processedItem.imageUrl);
                        foundImageUrl = true;
                    }
                } 
                if (!foundImageUrl && sourceData.Image && typeof sourceData.Image === 'object' && sourceData.Image.url) { 
                    processedItem.imageUrl = `${STRAPI_API_URL}${sourceData.Image.url}`;
                    console.log("Image found: Direct URL on Image object (Image.url)", processedItem.imageUrl);
                    foundImageUrl = true;
                }
                
                if (!foundImageUrl) {
                    console.warn("Could not find image URL after all attempts for item:", item);
                    processedItem.imageUrl = 'https://placehold.co/600x400/CCCCCC/333333?text=No+Image+Found'; 
                }

                console.log("Processed photo object for rendering:", processedItem);

            } catch (parseError) {
                console.error("Error parsing gallery item:", item, parseError);
                processedItem.title = `Error parsing item ${item.id}`; 
                processedItem.description = 'Check console for details on this item.';
                processedItem.imageUrl = 'https://placehold.co/600x400/FF0000/FFFFFF?text=Parsing+Error';
                processedItem.price = 'Error';
            }
            return processedItem;
          });
          
          setPhotos(formattedPhotos);
        } else {
          console.error("Strapi response for gallery items did not contain an array in 'data' field or was empty:", itemsResponse.data);
          setError('No gallery item entries found or published in Strapi, or unexpected data format from API.');
        }

        // --- Fetch Gallery Page Text (Collection Type, taking the first entry) ---
        const textApiUrl = `${STRAPI_API_URL}/api/${GALLERY_TEXTS_COLLECTION}?populate=*`;
        console.log(`Attempting to fetch gallery page text from: ${textApiUrl}`);
        const textResponse = await axios.get(textApiUrl);

        console.log("Raw response for Gallery Text API:", textResponse.data);

        if (textResponse.data && Array.isArray(textResponse.data.data) && textResponse.data.data.length > 0) { 
          const pageContentEntry = textResponse.data.data[0]; 
          
          console.log("Gallery Text pageContentEntry (first item from array):", pageContentEntry);
          console.log("Gallery Text pageContentEntry.attributes:", pageContentEntry.attributes);
          console.log("Gallery Text pageContentEntry.Title (direct):", pageContentEntry.Title);
          console.log("Gallery Text pageContentEntry.Body (direct):", pageContentEntry.Body);

          let pageTitle = 'Our Gallery';
          let pageBody = 'Add page description in Strapi.';

          if (pageContentEntry.Title) { 
              pageTitle = pageContentEntry.Title;
          } else if (pageContentEntry.title) { 
              pageTitle = pageContentEntry.title;
          } else if (pageContentEntry.attributes && pageContentEntry.attributes.Title) { 
              pageTitle = pageContentEntry.attributes.Title;
          } else if (pageContentEntry.attributes && pageContentEntry.attributes.title) { 
              pageTitle = pageContentEntry.attributes.title;
          }

          const rawBody = pageContentEntry.Body || pageContentEntry.body || 
                          (pageContentEntry.attributes && pageContentEntry.attributes.Body) || 
                          (pageContentEntry.attributes && pageContentEntry.attributes.body); 

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

          setGalleryPageContent({ title: pageTitle, body: pageBody });
          console.log("Gallery Page Content loaded successfully:", { title: pageTitle, body: pageBody });
        } else {
          console.warn("No gallery page content found from Strapi (empty data.data array for Collection Type):", textResponse.data);
          setGalleryPageContent({ title: 'Our Gallery', body: 'Add page description in Strapi.' });
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
      <div className="gallery-loading-error-container loading-state">
        Loading gallery...
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-loading-error-container error-state">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="gallery-container">
      {/* Display Gallery Page Title and Body */}
      {galleryPageContent ? (
        <>
          <h1 className="gallery-title">
            {galleryPageContent.title}
          </h1>
          <p className="gallery-page-body" style={{ whiteSpace: 'pre-line' }}>
            {galleryPageContent.body}
          </p>
        </>
      ) : (
        // Fallback for page content if it's not loaded yet
        <>
          <h1 className="gallery-title">Our Gallery</h1>
          <p className="gallery-page-body" style={{ whiteSpace: 'pre-line' }}>Loading page description...</p>
        </>
      )}
      
      {/* Display Gallery Items */}
      {photos.length === 0 ? (
        <p className="gallery-empty-message">No photos found in the gallery. Please add some in Strapi!</p>
      ) : (
        <div className="gallery-grid">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="gallery-card"
            >
              <div className="gallery-image-wrapper">
                {/* Image sizing and fitting */}
                <img 
                  src={photo.imageUrl} 
                  alt={photo.title} 
                  className="gallery-image"
                />
              </div>
              <h2 className="gallery-card-title">
                {photo.title}
              </h2>
              <p className="gallery-card-description" style={{ whiteSpace: 'pre-line' }}>
                {photo.description}
              </p>
              <div className="gallery-card-price">
                {photo.price !== 'N/A' ? `$${photo.price}` : 'Price: N/A'}
              </div>
              <button onClick={() => addToCart(photo)} className="gallery-add-to-cart-button">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Internal CSS for the Gallery component */}
      <style>
        {`
          /* Basic container for loading/error messages */
          .gallery-loading-error-container {
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

          .gallery-container {
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
            .gallery-container {
              padding: 2rem;
              padding-top: 6rem;
            }
          }

          .gallery-title {
            font-size: 2.8rem; 
            font-weight: 800;
            text-align: center;
            margin-bottom: 0.8rem; 
            color: #f0f0f0;
            font-family: 'Cormorant Garamond', serif;
          }

          .gallery-page-body {
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

          .gallery-empty-message {
            text-align: center;
            color: #f0f0f0;
            font-size: 1.1rem;
            font-family: 'Quicksand', sans-serif;
          }

          .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
            gap: 1.5rem; 
          }

          @media (min-width: 640px) { 
            .gallery-grid {
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
            }
          }

          @media (min-width: 768px) { 
            .gallery-grid {
              grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
            }
          }

          @media (min-width: 1024px) { 
            .gallery-grid {
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            }
          }

          .gallery-card {
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

          .gallery-card:hover {
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); 
            transform: translateY(-0.15rem); 
          }

          .gallery-image-wrapper {
            overflow: hidden; 
            border-radius: 0.6rem; 
            margin-bottom: 0.8rem; 
            width: 100%; 
            padding-top: 60%; 
            position: relative; 
            background-color: #f0f0f0; 
          }

          .gallery-image {
            position: absolute; 
            top: 0;
            left: 0;
            width: 100%;
            height: 100%; 
            object-fit: contain; 
            border-radius: 0.6rem;
            transition: transform 0.3s ease-in-out; 
          }

          .gallery-card:hover .gallery-image {
            transform: scale(1.02); 
          }

          .gallery-card-title {
            font-size: 1.2rem; 
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 0.3rem; 
            font-family: 'Cormorant Garamond', serif;
          }

          .gallery-card-description {
            color: #4b5563;
            font-size: 0.8rem; 
            flex-grow: 1;
            margin-bottom: 0.8rem;
            font-family: 'Quicksand', sans-serif;
            white-space: pre-line;
            word-break: break-word; 
            overflow-wrap: break-word; 
          }
          
          .gallery-card-price {
            font-size: 1.3rem; 
            font-weight: bold;
            color: #064420;
            margin-bottom: 1rem; 
            font-family: 'Helvetica Neue', sans-serif;
          }

          .gallery-add-to-cart-button {
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

          .gallery-add-to-cart-button:hover {
            background-color: #82c9a8;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .gallery-container {
              padding: 1rem;
              padding-top: 4rem; 
              width: 95%; 
            }

            .gallery-title {
              font-size: 2.2rem;
            }
            .gallery-page-body {
              font-size: 0.9rem;
              margin-bottom: 1.5rem;
            }
            .gallery-grid {
              gap: 1rem;
              grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); 
            }
            .gallery-card {
              padding: 0.7rem;
            }
            .gallery-image-wrapper {
              padding-top: 65%; 
            }
          }
        `}
      </style>
    </div>
  );
}

export default Gallery;