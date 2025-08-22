// path: ./src/api/email/routes/email.js
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/email/send',
      handler: 'email.send',
      config: {
        auth: false,
      },
    },
  ],
};