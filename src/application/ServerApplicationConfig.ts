import { Algorithm } from 'jsonwebtoken';
import { LoggerModes } from '@overnightjs/logger';

/**
 *
 * @author Ilya Pikin
 */

export default interface ServerApplicationConfig {
    production: boolean;
    loggerMode: LoggerModes;
    loggerFilePath?: string;
    serverPort: number;
    dbUri: string;
    sessionPrivateKey: string;
    sessionExpirationTime: string;
    sessionSingAlgorithm: Algorithm;
}