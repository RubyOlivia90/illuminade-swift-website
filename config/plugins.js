module.exports = ({ env }) => ({
 
  email: {
    config: {
      provider: 'nodemailer', 
      providerOptions: {
        host: env('BREVO_SMTP_HOST', 'smtp-relay.brevo.com'),
        port: env('BREVO_SMTP_PORT', 587),
        auth: {
          user: env('BREVO_SMTP_USER'), 
          pass: env('BREVO_SMTP_PASS'), 
        },
      },
      settings: {
        defaultFrom: env('BREVO_SENDER_EMAIL'), 
        defaultReplyTo: env('BREVO_SENDER_EMAIL'),
      },
    },
  },
});