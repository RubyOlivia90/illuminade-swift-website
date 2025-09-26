// config/plugins.js
module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: env('SENDGRID_DEFAULT_FROM', 'info.iluminade@gmail.com'),
        defaultReplyTo: env('SENDGRID_DEFAULT_REPLY_TO', 'info.iluminade@gmail.com'),
      },
    },
  },
  
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
    
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});