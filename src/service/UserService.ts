import { singleton, injectable } from 'tsyringe';
import UserRepository from '../repository/UserRepository';
import User, { UserRole } from '../entity/User';
import PasswordService from './PasswordService';
import JsonWebTokenService, { JsonWebToken } from './JsonWebTokenService';
import AuthorizationResult from '../dto/AuthorizationResult';
import HttpStatusCode from '../constants/HttpStatusCode';
import RefreshTokenService from './RefreshTokenService';
import RefreshToken from '../entity/RefreshToken';
import SeverErrorDescription from '../constants/ServerErrorDescription';
import ServerResponseResult from '../dto/ServerResponseResult';

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
        private readonly jsonWebTokenService: JsonWebTokenService,
        private readonly refreshTokenService: RefreshTokenService) { }

    public async login(login: string, password: string): Promise<AuthorizationResult> {
        const user: User | null = await this.userRepository.findByLogin(login);
        if (user && await this.passwordService.compare(password, user.password)) {
            const authenticationToken: string | null = await this.jsonWebTokenService.sign(user);
            const refreshToken: RefreshToken | null = await this.refreshTokenService.createNewToken(user);
            if (authenticationToken && refreshToken) {
                return {
                    httpStatusCode: HttpStatusCode.OK,
                    authorizationGranted: true,
                    authenticationToken,
                    refreshToken: refreshToken.token
                };
            }
        }
        return {
            httpStatusCode: HttpStatusCode.FORBIDDEN,
            errorDescription: SeverErrorDescription.FORBIDDEN_TO_ACCESS,
            authorizationGranted: false
        };
    }

    public async addNewUser(jsonWebToken: JsonWebToken, data: any | User): Promise<ServerResponseResult> {
        if (!jsonWebToken ||
            !this.checkRole(jsonWebToken.userRole, UserRole.ADMIN) ||
            !this.save(data)) {
            return {
                httpStatusCode: HttpStatusCode.FORBIDDEN,
                errorDescription: SeverErrorDescription.FORBIDDEN_TO_ACCESS,
                authorizationGranted: jsonWebToken != null
            };
        }
        return {
            httpStatusCode: HttpStatusCode.OK,
            authorizationGranted: true
        };
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
