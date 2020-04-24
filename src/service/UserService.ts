import { singleton, injectable } from 'tsyringe';
import UserRepository from '../repository/UserRepository';
import User from '../entity/User';
import PasswordService from './PasswordService';
import JsonWebTokenService from './JsonWebTokenService';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
export default class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly jsonWebTokenService: JsonWebTokenService) { }

    public async save(data: any | User): Promise<User | null> {
        if (!this.passwordService.validate(data.password)) {
            return null;
        }
        const password: string = await this.passwordService.hash(data.password);
        if (!password) {
            return null;
        }

        data.password = password;
        return this.userRepository.save(data);
    }

    public findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    public async login(login: string, password: string): Promise<string | null> {
        const user: User = await this.userRepository.findByLogin(login);
        let token: string = null;
        if (user && await this.passwordService.compare(password, user.password)) {
            token = this.jsonWebTokenService.sign(user);
        }
        return token;
    }
}
