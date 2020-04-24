import { injectable, singleton } from 'tsyringe';
import { Logger } from '@overnightjs/logger';
import PasswordValidator from 'password-validator';
import bcrypt from 'bcrypt';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
export default class PasswordService {
    private static readonly SALT_ROUNDS: number = 10;
    private static readonly MIN_LENGTH: number = 8;
    private static readonly MAX_LENGTH: number = 32;

    private readonly passwordValidator: PasswordValidator;

    constructor() {
        this.passwordValidator = new PasswordValidator()
            .is().min(PasswordService.MIN_LENGTH)
            .is().max(PasswordService.MAX_LENGTH)
            .has().uppercase()
            .has().lowercase()
            .has().symbols()
            .has().digits()
            .has().not().spaces();
    }

    public validate(password: string): boolean {
        return Boolean(this.passwordValidator.validate(password));
    }

    public async hash(password: string): Promise<string | null> {
        try {
            return await bcrypt.hash(password, PasswordService.SALT_ROUNDS);
        } catch (err) {
            Logger.Err('Password hashing error');
            Logger.Err(err);
        }
        return null;
    }

    public async compare(password: string, hashedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (err) {
            Logger.Err('Password comparing error');
            Logger.Err(err);
        }
        return false;
    }
}