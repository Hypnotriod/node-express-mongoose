import { injectable, singleton, inject } from 'tsyringe';
import { Logger } from '@overnightjs/logger';
import jwt from 'jsonwebtoken';
import ServerApplicationConfig from '../application/ServerApplicationConfig';
import User from '../entity/User';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
export default class JsonWebTokenService {
    constructor(@inject('ServerApplicationConfig') private readonly config: ServerApplicationConfig) { }

    public sign(user: User): string | null {
        let result: string = null;
        try {
            result = jwt.sign({ uuid: user.id }, this.config.sessionPrivateKey, {
                expiresIn: this.config.sessionExpirationTime
            });
        } catch (err) {
            Logger.Err(err);
        }
        return result;
    }

    public verify(token: string): string | null {
        let result: string = null;
        try {
            result = (jwt.verify(token, this.config.sessionPrivateKey) as { uuid: string }).uuid;
        } catch (err) {
            Logger.Info(err);
        }
        return result;
    }
}
