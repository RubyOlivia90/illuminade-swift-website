// src/api/email/controllers/email.js

const nodemailer = require('nodemailer');

module.exports = {
  async sendEmail(ctx) {
    const { name, email, message } = ctx.request.body;

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail', // This is the fix. Use 'gmail' as a known service.
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.EMAIL_RECIPIENT,
        subject: 'New Contact Form Submission',
        text: `You have a new message from your website contact form.
          Name: ${name}
          Email: ${email}
          Message: ${message}`,
        html: `<p>You have a new message from your website contact form.</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>`,
      };

      await transporter.sendMail(mailOptions);

      ctx.body = { message: 'Email sent successfully!' };
    } catch (error) {
      console.error('Error sending email:', error);
      ctx.throw(500, 'Failed to send message.');
    }
  },
};