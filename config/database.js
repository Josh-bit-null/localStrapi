const path = require('path');

module.exports = ({ env }) => {
  const dbUrl = env('DATABASE_URL');

  if (dbUrl) {
    return {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: dbUrl,
          ssl: { rejectUnauthorized: false },
        },
      },
    };
  }

  return {
    connection: {
      client: env('DATABASE_CLIENT', 'sqlite'),
      connection: {
        filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };
};