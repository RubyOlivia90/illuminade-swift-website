'use strict';
module.exports = {
  async send(ctx) {
    const { name, email, message } = ctx.request.body;

    try {
      await strapi.plugins['email'].services.email.send({
        to: 'your-client-email@example.com', // The recipient email
        from: 'no-reply@yourwebsite.com',    // Use the sender email from your .env file
        subject: `New Message from ${name}`,
        html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      });
      ctx.send({ message: 'Email sent successfully!' });
    } catch (err) {
      ctx.send({ error: 'Failed to send email' }, 500);
    }
  },
};