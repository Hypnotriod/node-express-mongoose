import { singleton, injectable } from 'tsyringe';
import User from '../entity/User';
import PasswordService from './PasswordService';
import JsonWebTokenService, { JsonWebToken } from './JsonWebTokenService';
import AuthorizationResult from '../dto/AuthorizationResult';
import RefreshTokenService from './RefreshTokenService';
import RefreshToken from '../entity/RefreshToken';
import ServerResponseService from './ServerResponseService';
import ServerResponseResult from '../dto/ServerResponseResult';
import UserService from './UserService';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
export default class UserAuthService {
    constructor(
        private readonly userService: UserService,
        private readonly passwordService: PasswordService,
        private readonly jsonWebTokenService: JsonWebTokenService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly serverResponseService: ServerResponseService) { }

    public async login(login: string | undefined, password: string | undefined): Promise<AuthorizationResult> {
        if (!login || !password) {
            return this.serverResponseService.generateForbidden();
        }
        const user: User | null = await this.userService.findByLogin(login);
        if (user && user.isActive && await this.passwordService.compare(password, user.password)) {
            const authenticationToken: string | null = await this.jsonWebTokenService.sign(user);
            const refreshToken: RefreshToken | null = await this.refreshTokenService.createNewToken(user);
            if (authenticationToken && refreshToken) {
                return this.serverResponseService.generateAuthorized(
                    authenticationToken,
                    refreshToken.token,
                    user.login);
            }
        }
        return this.serverResponseService.generateForbidden();
    }

    public async logout(jsonWebToken: JsonWebToken | undefined): Promise<ServerResponseResult> {
        if (!jsonWebToken) {
            return this.serverResponseService.generateForbidden();
        }
        await this.refreshTokenService.deleteAllByUserId(jsonWebToken.userId);
        return this.serverResponseService.generateOk();
    }

    public async refresh(providedRefreshToken: string | undefined): Promise<AuthorizationResult> {
        if (!providedRefreshToken) {
            return this.serverResponseService.generateForbidden();
        }
        let storedRefreshToken: RefreshToken | null = await this.refreshTokenService.findByToken(providedRefreshToken);
        if (!storedRefreshToken) {
            return this.serverResponseService.generateForbidden();
        }
        const user: User | null = await this.userService.findById(storedRefreshToken.userId);
        if (!user || !user.isActive) {
            return this.serverResponseService.generateForbidden();
        }
        await this.refreshTokenService.delete(storedRefreshToken);
        const newAuthenticationToken: string | null = await this.jsonWebTokenService.sign(user);
        const newRefreshToken: RefreshToken | null = await this.refreshTokenService.createNewToken(user);
        if (newAuthenticationToken && newRefreshToken) {
            return this.serverResponseService.generateAuthorized(
                newAuthenticationToken,
                newRefreshToken.token,
                user.login);
        } else {
            return this.serverResponseService.generateForbidden();
        }
    }
}
