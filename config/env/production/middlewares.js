module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      // Must be explicitly enabled
      enabled: true,
      headers: '*', 
      // Must include 'credentials: true' for modern APIs
      credentials: true, 
      // Allow all necessary HTTP methods
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      // CRITICAL: Must list all trusted origins
      origin: [
        'http://localhost:1337', // Local Strapi dev
        'http://localhost:5173', // Local frontend (Vite)
        'https://illuminade-swift.onrender.com', // Your deployed frontend (from error log)
        'https://illuminade-swift-website.onrender.com', // Your deployed backend (for self-reference if needed)
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