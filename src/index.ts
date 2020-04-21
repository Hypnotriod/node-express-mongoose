import ServerApplication from './application/ServerApplication';

/**
 *
 * @author Ilya Pikin
 */

new ServerApplication({
  production: (process.env.NODE_ENV === 'production'),
  serverPort: Number(process.env.PORT) || 3000,
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017/test_shop'
});
