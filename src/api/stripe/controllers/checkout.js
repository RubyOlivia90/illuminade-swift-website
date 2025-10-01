'use strict';
const { Stripe } = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = {
  async createCheckoutSession(ctx) {
    const { cartItems, successUrl } = ctx.request.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return ctx.badRequest('Cart items are required.');
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
          unit_amount: Math.round(parseFloat(item.price) * 100),
        },
        quantity: item.quantity || 1,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        // This is the fix: Use the successUrl sent directly from the frontend
        success_url: successUrl,
        cancel_url: `${ctx.request.header.origin}/checkout`,
      });

      return { stripeSession: { id: session.id } };

    } catch (error) {
      console.error('Stripe checkout session creation failed:', error);
      ctx.response.status = 500;
      return { error: { message: 'An internal error occurred.' } };
    }
  },
};