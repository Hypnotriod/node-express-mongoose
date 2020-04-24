import 'reflect-metadata';
import { container } from 'tsyringe';
import ServerApplication from './application/ServerApplication';
import ServerApplicationConfig from './application/ServerApplicationConfig';


/**
 *
 * @author Ilya Pikin
 */

const config: ServerApplicationConfig = {
  production: (process.env.NODE_ENV === 'production'),
  serverPort: Number(process.env.PORT) || 3000,
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017/test_shop',
  sessionPrivateKey: process.env.SESSION_PRIVATE_KEY || 'fq5a1e611ae803aa018be3c6d011be47',
  sessionExpirationTime: process.env.SESSION_EXPIRATION_TIME || '10m'
};

container.register('ServerApplicationConfig', { useValue: config });
container.resolve(ServerApplication).launch();
