import { singleton, injectable } from 'tsyringe';
import User, { UserRole } from '../entity/User';
import UserRepository from '../repository/UserRepository';
import PasswordService from './PasswordService';
import JsonWebTokenService, { JsonWebToken } from './JsonWebTokenService';

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
        if (user && await this.passwordService.compare(password, user.password)) {
            return await this.jsonWebTokenService.sign(user);
        }
        return null;
    }

    public async addNew(jsonWebToken: JsonWebToken, data: any | User): Promise<User | null> {
        if (!jsonWebToken) { return null; }
        if (!this.checkRole(jsonWebToken.userRole, UserRole.ADMIN)) { return null; }
        return this.save(data);
    }

    public async save(data: any | User): Promise<User | null> {
        if (!this.passwordService.validate(data.password)) {
            return null;
        }
        const hashedPassword: string | null = await this.passwordService.hash(data.password);
        if (!hashedPassword) {
            return null;
        }

        data.password = hashedPassword;
        return this.userRepository.save(data);
    }

    public checkRole(userRole: UserRole, ...permittedRoles: UserRole[]): boolean {
        if (!userRole) { return false; }
        return permittedRoles.includes(userRole);
    }

    public async checkRoleByUuid(uuid: string, ...permittedRoles: UserRole[]): Promise<boolean> {
        if (!uuid) { return false; }
        const user: User | null = await this.userRepository.findById(uuid);
        if (!user) { return false; }
        return permittedRoles.includes(user.role);
    }

    public findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }
}
