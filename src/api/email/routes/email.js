module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/email/send',
      handler: 'email.sendEmail',
      config: {
        auth: false,
      },
    },
  ],
};