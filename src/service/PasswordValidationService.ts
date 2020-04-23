import { injectable, singleton } from 'tsyringe';
import PasswordValidator from 'password-validator';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
export default class PasswordValidationService {
    private readonly passwordValidator: PasswordValidator;

    constructor() {
        this.passwordValidator = new PasswordValidator();
        this.passwordValidator
            .is().min(8)
            .is().max(16)
            .has().uppercase()
            .has().lowercase()
            .has().digits()
            .has().not().spaces();
    }

    public validate(password: string): boolean {
        return Boolean(this.passwordValidator.validate(password));
    }
}