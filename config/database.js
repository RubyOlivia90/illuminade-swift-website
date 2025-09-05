const path = require('path');

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');

  const connection =
    client === 'postgres'
      ? {
          host: env('DATABASE_HOST', 'localhost'),
          port: env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME', 'strapi'),
          user: env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', 'strapi'),
          ssl:
            env.bool('DATABASE_SSL', false) &&
            {
              rejectUnauthorized: env.bool(
                'DATABASE_SSL_REJECT_UNAUTHORIZED',
                true
              ),
            },
        }
      : {
          filename: path.join(
            __dirname,
            '..',
            env('DATABASE_FILENAME', '.tmp/data.db')
          ),
        };

  return {
    connection: {
      client,
      connection,
      useNullAsDefault: client === 'sqlite',
    },
  };
};
