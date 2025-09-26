module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      headers: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
      origin: [
        'http://localhost:1337',      // Local Strapi dev
        'http://localhost:5173',      // Local frontend (Vite)
        'https://illuminade-swift.onrender.com', // Your deployed frontend
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
