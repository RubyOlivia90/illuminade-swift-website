'use strict';

module.exports = {
  // This hook runs immediately after a new order entry is created in the database.
  async afterCreate(event) {
    const { result } = event; // 'result' contains the newly created order data

    // Log the event for debugging. This will appear in your terminal.
    strapi.log.info(`New order created: ${result.id}`);
    
    // Safety check to ensure the necessary data exists before sending the email.
    if (!result.customerEmail || !result.customerName || !result.total) {
      strapi.log.error('Cannot send order notification: missing customer information.');
      return;
    }

    try {
      // Use the email plugin to send the notification.
      await strapi.plugins['email'].services.email.send({
        // Set the recipient to the business owner's email address.
        to: 'iluminadeswiftproton.me@proton.me', 
        
        // Use a generic "no-reply" email as the sender. This must be a verified sender in Brevo.
        from: 'no-reply@yourwebsite.com',    
        
        // Create a clear and informative subject line.
        subject: `New Order from ${result.customerName} (#${result.id})`,
        
        // Construct the email body using HTML, populated with the order details.
        html: `
          <h1>New Order Received!</h1>
          <p>A new order has been placed on your website. Please fulfill it as soon as possible.</p>
          <hr />
          <h3>Order Details:</h3>
          <p><strong>Order ID:</strong> #${result.id}</p>
          <p><strong>Customer Name:</strong> ${result.customerName}</p>
          <p><strong>Customer Email:</strong> ${result.customerEmail}</p>
          <p><strong>Order Total:</strong> $${parseFloat(result.total).toFixed(2)}</p>
          <hr />
          <p>Log in to your Strapi admin panel to see the full details of this order and all other orders.</p>
        `,
      });

      strapi.log.info('Order notification email sent successfully.');
    } catch (err) {
      // Log any errors that occur during the email sending process.
      strapi.log.error('Failed to send order notification email:', err);
    }
  },
};