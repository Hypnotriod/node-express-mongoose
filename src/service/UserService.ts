import { singleton, injectable } from 'tsyringe';
import { JsonWebToken } from './JsonWebTokenService';
import User, { UserRole } from '../entity/User';
import UserRepository from '../repository/UserRepository';
import PasswordService from './PasswordService';
import ServerResponseResult from '../dto/ServerResponseResult';
import ServerResponseService from './ServerResponseService';
import AllowUserRoles from './decorator/AllowUserRoles';
import UserQueryResult from '../dto/UserQueryResult';

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
        if (!this.passwordService.validate(data.password) ||
            !await this.userRepository.validate(data)) {
            return this.serverResponseService.generateBadRequest();
        }
        if (!await this.save(data)) {
            return this.serverResponseService.generateConflict();
        }
        return this.serverResponseService.generateOk();
    }

    @AllowUserRoles([UserRole.ADMIN])
    public async deleteUser(jsonWebToken: JsonWebToken | undefined, userId: string | undefined): Promise<ServerResponseResult> {
        if (!userId) {
            return this.serverResponseService.generateBadRequest();
        }
        const user: User | null = await this.userRepository.findById(userId);
        if (!user || !await this.delete(user)) {
            return this.serverResponseService.generateConflict();
        }
        return this.serverResponseService.generateOk();
    }

    @AllowUserRoles([UserRole.ADMIN])
    public async setUserActiveState(
        jsonWebToken: JsonWebToken | undefined,
        userId: string | undefined,
        isActive: boolean | undefined): Promise<ServerResponseResult> {
        if (!userId || isActive === undefined) {
            return this.serverResponseService.generateBadRequest();
        }
        const user: User | null = await this.userRepository.findById(userId);
        if (!user) {
            return this.serverResponseService.generateConflict();
        }
        user.isActive = isActive;
        if (!await this.save(user)) {
            return this.serverResponseService.generateConflict();
        }
        return this.serverResponseService.generateOk();
    }

    @AllowUserRoles([UserRole.ADMIN])
    public async getAllUsers(jsonWebToken: JsonWebToken | undefined): Promise<ServerResponseResult> {
        const users: User[] = await this.findAll();
        return this.serverResponseService.generateOkWithData(
            true, users.map(this.mapToUserQueryResult.bind(this)));
    }

    @AllowUserRoles([UserRole.ADMIN])
    public async getUserById(jsonWebToken: JsonWebToken | undefined, userId: string): Promise<ServerResponseResult> {
        const user: User | null = await this.findById(userId);
        return this.serverResponseService.generateOkWithData(
            true, !user ? null : this.mapToUserQueryResult(user));
    }

    public async changeUserPassword(
        login: string | undefined,
        oldPassword: string | undefined,
        newPassword: string | undefined,
        newPasswordConfirm: string | undefined): Promise<ServerResponseResult> {
        if (!login || !oldPassword || !newPassword) {
            return this.serverResponseService.generateForbidden();
        }
        const user: User | null = await this.findByLogin(login);
        if (!user || !user.isActive || !await this.passwordService.compare(oldPassword, user.password)) {
            return this.serverResponseService.generateForbidden();
        }
        if (!this.passwordService.validate(newPassword) || newPassword !== newPasswordConfirm) {
            return this.serverResponseService.generateBadRequest();
        }
        user.password = newPassword;
        if (!await this.save(user)) {
            return this.serverResponseService.generateConflict();
        }
        return this.serverResponseService.generateOk();
    }

    public async save(data: any | User): Promise<User | null> {
        const hashedPassword: string | null = await this.passwordService.hash(data.password);
        if (!hashedPassword) {
            return null;
        }

        data.password = hashedPassword;
        return this.userRepository.save(data);
    }

    public delete(user: User): Promise<User | null> {
        return this.userRepository.delete(user);
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

    private mapToUserQueryResult(user: User): UserQueryResult {
        return {
            id: user.id,
            login: user.login,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt!,
            updatedAt: user.updatedAt!,
            version: user.__v!,
        };
    }
}
