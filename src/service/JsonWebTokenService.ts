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
    userId: string;
    userRole: UserRole;
    exp?: number;
    iat?: number;
};

@injectable()
@singleton()
export default class JsonWebTokenService {
    constructor(private readonly config: ServerApplicationConfig) { }

    public sign(user: User): Promise<string | null> {
        return new Promise<string | null>((resolve, reject) => {
            const jsonWebToken: JsonWebToken = {
                userId: user.id,
                userRole: user.role,
            };
            jwt.sign(jsonWebToken,
                this.config.sessionPrivateKey, {
                expiresIn: this.config.sessionExpirationTime,
                algorithm: this.config.sessionSingAlgorithm,
            }, (err: Error | null, encoded: string | undefined) => {
                if (err) {
                    Logger.Err(err);
                    resolve(null);
                } else {
                    resolve(encoded!);
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

    public decode(token: string): JsonWebToken | null {
        return jwt.decode(token) as JsonWebToken | null;
    }
}
