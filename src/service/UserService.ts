import { singleton, injectable } from 'tsyringe';
import UserRepository from '../repository/UserRepository';
import User, { UserRole } from '../entity/User';
import PasswordService from './PasswordService';
import { JsonWebToken } from './JsonWebTokenService';
import ServerResponseResult from '../dto/ServerResponseResult';
import ServerResponseService from './ServerResponseService';
import AllowUserRoles from './decorator/AllowUserRoles';

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
        private readonly serverResponseService: ServerResponseService) { }

    @AllowUserRoles([UserRole.ADMIN])
    public async addNewUser(jsonWebToken: JsonWebToken | undefined, data: any | User): Promise<ServerResponseResult> {
        if (!await this.save(data)) {
            return this.serverResponseService.generateMalformed(jsonWebToken !== undefined);
        }
        return this.serverResponseService.generateOk();
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

    public findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    public findByLogin(login: string): Promise<User | null> {
        return this.userRepository.findByLogin(login);
    }

    public findById(userId: string): Promise<User | null> {
        return this.userRepository.findById(userId);
    }
}
