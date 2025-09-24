// src/api/order/routes/order.js

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/orders',
      handler: 'order.create',
      config: {
        auth: false,
      },
    },
  ],
};