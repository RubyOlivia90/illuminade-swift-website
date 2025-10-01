'use strict';
// Using your original, correct way to initialize Stripe
const { Stripe } = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = {
  async createCheckoutSession(ctx) {
    // Get both cartItems and the successUrl from the frontend request
    const { cartItems, successUrl } = ctx.request.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return ctx.badRequest('Cart items are required.');
    }

    if (!successUrl) {
      return ctx.badRequest('The successUrl is required.');
    }

    try {
      const lineItems = cartItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            description: item.description,
            images: item.imageUrl ? [item.imageUrl] : [],
          },
          // Always ensure price is an integer in cents
          unit_amount: Math.round(parseFloat(item.price) * 100),
        },
        quantity: item.quantity || 1,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        // Use the dynamic success_url from the frontend for correct redirection
        success_url: successUrl,
        cancel_url: `${ctx.request.header.origin}/checkout`, // Go back to checkout on cancel
      });

      // Return the session in the format the frontend is expecting
      return { stripeSession: { id: session.id } };

    } catch (error) {
      console.error('Stripe checkout session creation failed:', error);
      // Send a generic error to the frontend for security
      ctx.response.status = 500;
      return { error: { message: 'An internal error occurred while creating the checkout session.' } };
    }
  },
};