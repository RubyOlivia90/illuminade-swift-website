// path: src/api/stripe/controllers/checkout.js

'use strict';
const { Stripe } = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = {
  async createCheckoutSession(ctx) {
    const { cartItems, successUrl: originalSuccessUrl } = ctx.request.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return ctx.badRequest('Cart items are required.');
    }

    // This is the key change: We ignore the successUrl from the frontend
    // and build our own to point to the new redirect page.
    const item = cartItems[0];
    const params = new URLSearchParams({
        imageUrl: item.imageUrl,
        title: item.title
    }).toString();

    const success_url = `${ctx.request.header.origin}/redirect.html?${params}`;

    try {
      const lineItems = cartItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            description: item.description,
            images: item.imageUrl ? [item.imageUrl] : [],
          },
          unit_amount: Math.round(parseFloat(item.price) * 100),
        },
        quantity: item.quantity || 1,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: success_url, // Use our new redirect URL
        cancel_url: `${ctx.request.header.origin}/#/checkout`, // Go back to checkout on cancel
      });

      return { stripeSession: { id: session.id } };

    } catch (error) {
      console.error('Stripe checkout session creation failed:', error);
      ctx.response.status = 500;
      return { error: { message: 'An internal error occurred while creating the checkout session.' } };
    }
  },
};