module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      headers: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
      origin: [
        'http://localhost:1337', // For local development
        'http://localhost:5173', // For local development with Vite
        process.env.CORS_ORIGIN, // For your deployed frontend
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
