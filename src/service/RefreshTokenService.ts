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

    public async createNewToken(user: User): Promise<RefreshToken | null> {
        return this.refreshTokenRepository.save({
            userId: user.id, token: uuid()
        });
    }

    public async delete(refreshToken: RefreshToken): Promise<RefreshToken | null> {
        return this.refreshTokenRepository.delete(refreshToken);
    }
}