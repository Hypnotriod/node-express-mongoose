import { Algorithm } from 'jsonwebtoken';
import { LoggerModes } from '@overnightjs/logger';
import { injectable } from 'tsyringe';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
export default class ServerApplicationConfig {
    production: boolean;
    loggerMode: LoggerModes;
    loggerFilePath?: string;
    serverPort: number;
    dbUri: string;
    sessionPrivateKey: string;
    sessionExpirationTime: string;
    sessionSingAlgorithm: Algorithm;
}
