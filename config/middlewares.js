module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          // CRITICAL FIX: Whitelist your Cloudinary domain for image loading
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'https://market-assets.strapi.io',
            `https://res.cloudinary.com`, // Allow all Cloudinary resources
          ],
          // Also whitelist Cloudinary for media and frame loading if necessary
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            `https://res.cloudinary.com`,
          ],
          'frame-src': [
            "'self'",
            'data:',
            'blob:',
            `https://res.cloudinary.com`,
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      credentials: true, 
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      // Final universal origins to prevent CORS errors during dev/prod testing
      origin: [
        'http://localhost:1337', // Local Strapi dev
        'http://localhost:5173', // Local frontend (Vite)
        'https://illuminade-swift.onrender.com', // Your deployed frontend
        'https://illuminade-swift-website.onrender.com', // Your backend URL
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];