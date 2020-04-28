import { container } from 'tsyringe';
import ServerApplicationConfig from '../../src/application/ServerApplicationConfig';
import ServerApplication from '../../src/application/ServerApplication';
import PasswordService from '../../src/service/PasswordService';
import UserModel from '../../src/model/UserModel';
import { UserRole } from '../../src/entity/User';

/**
 *
 * @author Ilya Pikin
 */

export const USER_LOGIN_ADMIN: string = 'admin';
export const USER_PASS_ADMIN: string = 'PassW@r2';
export const USER_LOGIN_INVALID: string = 'admin2';
export const USER_PASS_INVALID: string = 'PassW@r3';

export default class UserAuthTestEnvironment {
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
            serverPort: 3000,
            dbUri: 'mongodb://localhost:27017/goods_store_test',
            sessionPrivateKey: 'fq5a1e611ae803aa018be3c6d011be47',
            sessionExpirationTime: '1ms',
            sessionSingAlgorithm: 'HS256',
        };

        container.register('ServerApplicationConfig', { useValue: config });
        return container.resolve(ServerApplication).launchTest();
    }

    private async fillDatabaseWithTestData(): Promise<void> {
        const passwordService: PasswordService = container.resolve(PasswordService);

        await UserModel.deleteMany({});
        await new UserModel({
            login: USER_LOGIN_ADMIN,
            password: await passwordService.hash(USER_PASS_ADMIN),
            role: UserRole.ADMIN,
            isActive: true,
        }).save();
    }
}
