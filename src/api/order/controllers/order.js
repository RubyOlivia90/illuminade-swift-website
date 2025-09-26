// src/api/order/controllers/order.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default {
  async create(ctx) {
    const { cartItems } = ctx.request.body;
    const STRAPI_API_URL = process.env.VITE_STRAPI_API_URL;

    try {
      const products = await strapi.db.query('api::product.product').findMany();

      const lineItems = cartItems.map(item => {
        const product = products.find(p => p.StripeProductID === item.stripeProductId);
        if (!product) throw new Error(`Product not found for Stripe ID: ${item.stripeProductId}`);

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.title,
              images: [`${STRAPI_API_URL}${product.ProductImage.url}`],
            },
            unit_amount: Math.round(product.Price * 100),
          },
          quantity: item.quantity,
        };
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        shipping_address_collection: { allowed_countries: ['US', 'CA'] },
        line_items: lineItems,
        mode: 'payment',
        success_url: `${STRAPI_API_URL}/download?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${STRAPI_API_URL}/checkout`,
      });

      ctx.body = { url: session.url };
    } catch (error) {
      console.error('Stripe Checkout Error:', error);
      ctx.response.status = 500;
      ctx.body = { error: error.message };
    }
  },
};
