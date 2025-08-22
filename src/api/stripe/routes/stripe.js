module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/stripe/create-checkout-session',
      handler: 'checkout.createCheckoutSession', // Links to the controller function
      config: {
        auth: false, // Allows unauthenticated requests to this endpoint for checkout
      },
    },
  ],
};