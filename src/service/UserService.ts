import { singleton, injectable } from 'tsyringe';
import UserRepository from '../repository/UserRepository';
import User, { UserRole } from '../entity/User';
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

    public async login(login: string, password: string): Promise<string | null> {
        const user: User | null = await this.userRepository.findByLogin(login);
        let token: string;
        if (user && await this.passwordService.compare(password, user.password)) {
            return await this.jsonWebTokenService.sign(user);
        }
        return null;
    }

    public async addNew(uuid: string, data: any | User): Promise<User | null> {
        if (!await this.checkRoleByUuid(uuid, [UserRole.ADMIN])) { return null; }
        return this.save(data);
    }

    public async save(data: any | User): Promise<User | null> {
        if (!this.passwordService.validate(data.password)) {
            return null;
        }
        const password: string | null = await this.passwordService.hash(data.password);
        if (!password) {
            return null;
        }

        data.password = password;
        return this.userRepository.save(data);
    }

    public async checkRoleByUuid(uuid: string, roles: UserRole[]): Promise<boolean> {
        if (!uuid) { return false; }
        const user: User | null = await this.userRepository.findById(uuid);
        if (!user) { return false; }
        return roles.includes(user.role);
    }

    public findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }
}
