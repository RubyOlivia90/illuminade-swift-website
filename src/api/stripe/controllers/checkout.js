'use strict';
const { Stripe } = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = {
  async createCheckoutSession(ctx) {
    const { cartItems } = ctx.request.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return ctx.badRequest('Cart items are required.');
    }

    try {
      const item = cartItems[0];
      // Create the query parameters for the redirect
      const params = new URLSearchParams({
          imageUrl: item.imageUrl,
          title: item.title
      }).toString();

      // THIS IS THE FIX: Point the success_url to our new redirect page
      const success_url = `${ctx.request.header.origin}/redirect.html?${params}`;

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
        cancel_url: `${ctx.request.header.origin}/#/checkout`,
      });

      return { stripeSession: { id: session.id } };

    } catch (error) {
      console.error('Stripe checkout session creation failed:', error);
      ctx.response.status = 500;
      return { error: { message: 'An internal error occurred.' } };
    }
  },
};