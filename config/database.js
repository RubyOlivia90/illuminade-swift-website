const path = require('path');

module.exports = ({ env }) => ({
  connection: {
    client: env('DATABASE_CLIENT', 'sqlite'),
    connection:
      env('DATABASE_CLIENT', 'sqlite') === 'postgres'
        ? {
            host: env('DATABASE_HOST'),
            port: env.int('DATABASE_PORT', 5432),
            database: env('DATABASE_NAME'),
            user: env('DATABASE_USERNAME'),
            password: env('DATABASE_PASSWORD'),
            ssl: env.bool('DATABASE_SSL', false) && {
              rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
            },
          }
        : {
            filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
          },
    useNullAsDefault: true,
  },
});