import { Algorithm } from 'jsonwebtoken';

/**
 *
 * @author Ilya Pikin
 */

export default interface ServerApplicationConfig {
    production: boolean;
    serverPort: number;
    dbUri: string;
    sessionPrivateKey: string;
    sessionExpirationTime: string;
    sessionSingAlgorithm: Algorithm;
}