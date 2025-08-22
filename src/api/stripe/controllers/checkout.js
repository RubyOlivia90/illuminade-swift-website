'use strict';
// Destructure the Stripe class from the imported module
const { Stripe } = require('stripe'); 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Correct initialization

module.exports = {
  async createCheckoutSession(ctx) {
    const { cartItems } = ctx.request.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return ctx.badRequest('Cart items are required.', { error: 'No items in cart' });
    }

    try {
      const lineItems = cartItems.map(item => ({
        price_data: {
          currency: 'usd', // Ensure this matches your Stripe account currency
          product_data: {
            name: item.title,
            // If you have product images from Strapi, you can add them here:
            // images: [item.imageUrl], // Ensure imageUrl is a full public URL
          },
          unit_amount: Math.round(parseFloat(item.price) * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        // success_url and cancel_url should point back to your frontend
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      });

      return { url: session.url }; // Return the Stripe Checkout Session URL

    } catch (error) {
      console.error('Stripe checkout session creation failed:', error);
      ctx.badImplementation('Failed to create checkout session.', { error: error.message });
    }
  },
};