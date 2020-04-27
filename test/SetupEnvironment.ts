import ServerApplicationConfig from '../src/application/ServerApplicationConfig';
import ServerApplication from '../src/application/ServerApplication';
import { container } from 'tsyringe';

/**
 *
 * @author Ilya Pikin
 */

export default function setupEnvironment(): Promise<ServerApplication> {
    const config: ServerApplicationConfig = {
        production: true,
        serverPort: 3000,
        dbUri: 'mongodb://localhost:27017/test_shop',
        sessionPrivateKey: 'fq5a1e611ae803aa018be3c6d011be47',
        sessionExpirationTime: '1ms',
        sessionSingAlgorithm: 'HS256',
    };

    container.register('ServerApplicationConfig', { useValue: config });
    return container.resolve(ServerApplication).launch();
}
