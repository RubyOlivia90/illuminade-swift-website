// path: ./src/api/email/controllers/email.js
'use strict';

/**
 * email controller
 */

module.exports = {
  async send(ctx) {
    const { name, email, phone, address, city, state, zip } = ctx.request.body;
    const siteOwnerEmail = 'iluminadeswiftproton.me@proton.me';
    
    // Check if required fields are present
    if (!name || !email || !phone || !address || !city || !state || !zip) {
      return ctx.badRequest('Missing required customer information.');
    }
    
    // Construct the email body for the site owner
    const emailBody = `New Order from Illuminade Website!

Customer Information:
Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}, ${city}, ${state}, ${zip}

Order Details:
(Awaiting payment confirmation)

Please contact the customer to confirm the order and arrange payment.`;

    try {
      // Send the email using Strapi's built-in email service
      await strapi.plugins['email'].services.email.send({
        to: siteOwnerEmail,
        from: 'no-reply@yourwebsite.com', // Change this to your "from" email address
        subject: 'New Order Received',
        html: emailBody.replace(/\n/g, '<br />'), // Convert newlines to HTML breaks
      });
      
      // Respond with a success message
      ctx.send({ message: 'Order email sent successfully!' });

    } catch (err) {
      // Handle errors during email sending
      ctx.send({ error: 'Failed to send order email.' }, 500);
    }
  },
};