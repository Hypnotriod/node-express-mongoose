import { singleton } from 'tsyringe';
import Repository from './Repository';
import RefreshToken from '../entity/RefreshToken';
import RefreshTokenModel from '../model/RefreshTokenModel';

/**
 *
 * @author Ilya Pikin
 */

@singleton()
export default class RefreshTokenRepository extends Repository<RefreshToken> {
    constructor() {
        super(RefreshTokenModel);
    }

    public findByToken(token: string): Promise<RefreshToken | null> {
        return this.findOne({ token });
    }

    public findAllByUserId(userId: string): Promise<RefreshToken[]> {
        return this.find({ userId });
    }

    public deleteAllByUserId(userId: string): Promise<{ deletedCount?: number } | null> {
        return this.deleteMany({ userId });
    }
}