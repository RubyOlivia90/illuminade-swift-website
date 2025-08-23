import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../CartContext';
import ReactMarkdown from 'react-markdown';

// Corrected to use the environment variable from .env
const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL;

const GALLERY_ITEMS_COLLECTION = 'gallery-items';
const GALLERY_TEXTS_COLLECTION = 'gallery-texts';

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [galleryPageContent, setGalleryPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
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
                price: 'N/A',
                stripeProductId: 'N/A'
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


                processedItem.stripeProductId = sourceData.StripeProductID || sourceData.stripeProductId || 'N/A';
                if (processedItem.stripeProductId === 'N/A') {
                    console.warn("StripeProductID field not found or is null/undefined for item:", item.id);
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

          let pageTitle = 'My Gallery';
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
      {/* Display Gallery Page Title and Body */}
      {galleryPageContent ? (
        <>
          <h1 className="gallery-title" style={{ textAlign: 'center' }}>
            {galleryPageContent.title}
          </h1>
          <p className="gallery-page-body" style={{ whiteSpace: 'pre-line', textAlign: 'center' }}>
            {galleryPageContent.body}
          </p>
        </>
      ) : (
        // Fallback for page content if it's not loaded yet
        <>
          <h1 className="gallery-title" style={{ textAlign: 'center' }}>Our Gallery</h1>
          <p className="gallery-page-body" style={{ whiteSpace: 'pre-line', textAlign: 'center' }}>Loading page description...</p>
        </>
      )}

      {/* Display Photos */}
      {photos.length === 0 ? (
        <p className="gallery-empty-message" style={{ textAlign: 'center', color: '#f0f0f0', fontSize: '1.1rem' }}>No photos found in the gallery. Please add some in Strapi!</p>
      ) : (
        <div className="gallery-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            width: '100%',
            marginTop: '2rem'
        }}>
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="gallery-card"
              style={{
                  backgroundColor: '#FFCCFF',
                  padding: '0.9rem',
                  borderRadius: '0.8rem',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textAlign: 'center'
              }}
            >
              <div className="gallery-image-wrapper" style={{
                  overflow: 'hidden',
                  borderRadius: '0.6rem',
                  marginBottom: '0.8rem',
                  width: '100%',
                  height: '250px', // Fixed height for images
                  position: 'relative',
                  backgroundColor: '#f0f0f0'
              }}>
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="gallery-image"
                  style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover', // Cover to fill the space
                      borderRadius: '0.6rem'
                  }}
                />
              </div>
              <h2 className="gallery-card-title" style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '0.3rem'
                }}>
                {photo.title}
              </h2>
              <p className="gallery-card-description" style={{
                    whiteSpace: 'pre-line',
                    color: '#757575ff',
                    fontSize: '0.8rem',
                    flexGrow: 1,
                    marginBottom: '0.8rem',
                    overflow: 'hidden',        // ADDED for text truncation
                    display: '-webkit-box',    // ADDED for text truncation
                    webkitLineClamp: 3,       // ADDED: Limit to 3 lines
                    webkitBoxOrient: 'vertical' // ADDED for text truncation
                }}>
                {photo.description}
              </p>
              <div className="gallery-card-price" style={{
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    color: '#000000ff',
                    marginBottom: '1rem'
                }}>
                {photo.price !== 'N/A' ? `$${photo.price}` : 'Price: N/A'}
              </div>
              <button onClick={() => addToCart(photo)} className="gallery-add-to-cart-button" style={{
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
                }}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Gallery;