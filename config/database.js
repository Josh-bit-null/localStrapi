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
        host: env('DATABASE_HOST', 'db.axjnpykpynhpszncjefl.supabase.co'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'postgres'),
        username: env('DATABASE_USERNAME', 'postgres'),
        password: env('DATABASE_PASSWORD'),
        ssl: { rejectUnauthorized: false },
        filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };
};