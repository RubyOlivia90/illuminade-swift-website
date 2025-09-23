'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
// @ts-ignore
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  // ✅ This is your custom action
  async createSession(ctx) {
    const { items, customer } = ctx.request.body;

    if (!items || !items.length) {
      return ctx.throw(400, 'No items provided');
    }

    const line_items = items.map(item => ({
      price: item.stripeProductId, // must be a Stripe Price ID
      quantity: item.quantity || 1,
    }));

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        customer_email: customer.email,
        success_url: `${process.env.FRONTEND_URL}/download?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      });

      return { url: session.url };
    } catch (err) {
      console.error('Stripe checkout session error:', err);
      ctx.throw(500, err.message);
    }
  },
}));
