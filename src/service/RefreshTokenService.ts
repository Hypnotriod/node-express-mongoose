import { singleton, injectable } from 'tsyringe';
import { uuid } from 'uuidv4';
import RefreshTokenRepository from '../repository/RefreshTokenRepository';
import User from '../entity/User';
import RefreshToken from '../entity/RefreshToken';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
export default class RefreshTokenService {
    constructor(private readonly refreshTokenRepository: RefreshTokenRepository) { }

    public createNewToken(user: User): Promise<RefreshToken | null> {
        return this.refreshTokenRepository.save({
            userId: user.id, token: uuid()
        });
    }

    public findByToken(token: string): Promise<RefreshToken | null> {
        return this.refreshTokenRepository.findByToken(token);
    }

    public findAllByUserId(userId: string): Promise<RefreshToken[]> {
        return this.refreshTokenRepository.findAllByUserId(userId);
    }

    public deleteAllByUserId(userId: string): Promise<{ deletedCount?: number } | null> {
        return this.refreshTokenRepository.deleteAllByUserId(userId);
    }

    public delete(refreshToken: RefreshToken): Promise<RefreshToken | null> {
        return this.refreshTokenRepository.delete(refreshToken);
    }
}