'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/orders/create-session',
      handler: 'order.createSession', // must match controller action
      config: { auth: false },
    },
  ],
};
