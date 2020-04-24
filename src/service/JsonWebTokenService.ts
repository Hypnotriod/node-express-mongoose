import { injectable, singleton, inject } from 'tsyringe';
import { Logger } from '@overnightjs/logger';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import ServerApplicationConfig from '../application/ServerApplicationConfig';
import User, { UserRole } from '../entity/User';

/**
 *
 * @author Ilya Pikin
 */

export type JsonWebToken = {
    uuid: string;
    role: UserRole;
};

@injectable()
@singleton()
export default class JsonWebTokenService {
    constructor(@inject('ServerApplicationConfig') private readonly config: ServerApplicationConfig) { }

    public sign(user: User): Promise<string | null> {
        return new Promise<string | null>((resolve, reject) => {
            const jsonWebToken: JsonWebToken = {
                uuid: user.id,
                role: user.role
            };
            jwt.sign(jsonWebToken,
                this.config.sessionPrivateKey, {
                expiresIn: this.config.sessionExpirationTime,
                algorithm: this.config.sessionSingAlgorithm
            }, (err: Error | null, encoded: string | undefined) => {
                if (err) {
                    Logger.Err(err);
                    resolve(null);
                } else {
                    resolve(encoded);
                }
            });
        });
    }

    public verify(token: string): Promise<JsonWebToken | null> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.config.sessionPrivateKey,
                (err: VerifyErrors | null, decoded: object | undefined) => {
                    if (err) {
                        Logger.Info(err);
                        resolve(null);
                    } else {
                        resolve(decoded as JsonWebToken);
                    }
                });
        });
    }
}
