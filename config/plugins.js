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
});