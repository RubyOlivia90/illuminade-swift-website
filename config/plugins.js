module.exports = ({ env }) => ({
  // Configure the email plugin (already present)
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
  
  // ADD: Configure the upload plugin to use Cloudinary
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