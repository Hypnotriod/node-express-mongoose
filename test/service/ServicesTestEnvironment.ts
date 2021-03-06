import { container } from 'tsyringe';
import ServerApplicationConfig from '../../src/application/ServerApplicationConfig';
import ServerApplication from '../../src/application/ServerApplication';
import PasswordService from '../../src/service/PasswordService';
import UserModel from '../../src/model/UserModel';
import { UserRole } from '../../src/entity/User';
import RefreshTokenModel from '../../src/model/RefreshTokenModel';
import { LoggerModes } from '@overnightjs/logger';

/**
 *
 * @author Ilya Pikin
 */

export const ADMIN_USER_LOGIN: string = 'admin';
export const USER_TO_DELETE_LOGIN: string = 'userto.delete';
export const USER_TO_LOGOUT_LOGIN: string = 'logout.user';
export const USER_TO_LOGOUT_ON_TIMEOUT_LOGIN: string = 'logoutontimeout.user';
export const INACTIVE_USER_LOGIN: string = 'inactive.user';
export const ACTIVE_USER_LOGIN: string = 'active.user';
export const VALID_USER_PASS: string = 'PassW@r2';
export const INVALID_USER_PASS: string = 'PassW@r3';
export const INVALID_USER_LOGIN: string = 'admin2';
export const INVALID_REFRESH_TOKEN: string = 'invalid-refresh-token';

export default class ServicesTestEnvironment {
    private serverApplication: ServerApplication;

    public async setup(): Promise<void> {
        this.serverApplication = await this.setupServerApplication();
        await this.fillDatabaseWithTestData();
    }

    public terminate(): Promise<void> {
        return this.serverApplication.terminate();
    }

    private setupServerApplication(): Promise<ServerApplication> {
        const config: ServerApplicationConfig = {
            production: true,
            loggerMode: LoggerModes.Off,
            serverPort: 3000,
            dbUri: 'mongodb://localhost:27017/goods_store_test',
            sessionPrivateKey: 'fq5a1e611ae803aa018be3c6d011be47',
            sessionExpirationTime: '1s',
            sessionSingAlgorithm: 'HS256',
        };

        container.register(ServerApplicationConfig, { useValue: config });
        return container.resolve(ServerApplication).launchTest();
    }

    private async fillDatabaseWithTestData(): Promise<void> {
        const passwordService: PasswordService = container.resolve(PasswordService);

        await RefreshTokenModel.deleteMany({});
        await UserModel.deleteMany({});
        await new UserModel({
            login: ADMIN_USER_LOGIN,
            password: await passwordService.hash(VALID_USER_PASS),
            role: UserRole.ADMIN,
            isActive: true,
        }).save();
        await new UserModel({
            login: USER_TO_LOGOUT_LOGIN,
            password: await passwordService.hash(VALID_USER_PASS),
            role: UserRole.ADMIN,
            isActive: true,
        }).save();
        await new UserModel({
            login: USER_TO_LOGOUT_ON_TIMEOUT_LOGIN,
            password: await passwordService.hash(VALID_USER_PASS),
            role: UserRole.ADMIN,
            isActive: true,
        }).save();
        await new UserModel({
            login: USER_TO_DELETE_LOGIN,
            password: await passwordService.hash(VALID_USER_PASS),
            role: UserRole.ADMIN,
            isActive: true,
        }).save();
        await new UserModel({
            login: INACTIVE_USER_LOGIN,
            password: await passwordService.hash(VALID_USER_PASS),
            role: UserRole.ADMIN,
            isActive: false,
        }).save();
        await new UserModel({
            login: ACTIVE_USER_LOGIN,
            password: await passwordService.hash(VALID_USER_PASS),
            role: UserRole.ADMIN,
            isActive: true,
        }).save();
    }
}
