// src/api/email/controllers/email.js

export default {
  async sendEmail(ctx) {
    const { name, email, message } = ctx.request.body;

    try {
      await strapi.plugin('email').service('email').send({
        to: process.env.EMAIL_RECIPIENT,          // Your recipient
        from: process.env.SENDGRID_DEFAULT_FROM,  // Verified SendGrid sender
        replyTo: email,                            // User can be replied to directly
        subject: 'New Contact Form Submission',
        text: `You have a new message from your website contact form.
Name: ${name}
Email: ${email}
Message: ${message}`,
        html: `<p>You have a new message from your website contact form.</p>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong> ${message}</p>`,
      });

      ctx.body = { message: 'Email sent successfully!' };
    } catch (error) {
      console.error('SendGrid Email Error:', error);
      ctx.response.status = 500;
      ctx.body = { error: 'Failed to send email.' };
    }
  },
};
