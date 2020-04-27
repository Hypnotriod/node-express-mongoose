import setupEnvironment from '../SetupEnvironment';
import ServerApplication from '../../src/application/ServerApplication';
import setupDatabase from '../SetupDatabase';
import UserAuthService from '../../src/service/UserAuthService';
import AuthorizationResult from '../../src/dto/AuthorizationResult';
import { USER_LOGIN_ADMIN, USER_PASS_ADMIN } from '../constants/Constants';
import HttpStatusCode from '../../src/constants/HttpStatusCode';
import { container } from 'tsyringe';

/**
 *
 * @author Ilya Pikin
 */

let serverApplication: ServerApplication;
let userAuthService: UserAuthService;

beforeAll(async (done) => {
    serverApplication = await setupEnvironment();
    await setupDatabase();
    userAuthService = container.resolve(UserAuthService);
    done();
});

afterAll(async (done) => {
    await serverApplication.terminate();
    done();
});

describe('User authorization & authentication', () => {
    test('User should get authentication and refresh tokens on login, with right creadentials', async done => {
        const result: AuthorizationResult = await userAuthService.login(USER_LOGIN_ADMIN, USER_PASS_ADMIN);
        expect(result.httpStatusCode).toBe(HttpStatusCode.OK);
        expect(result.authorizationGranted).toBe(true);
        expect(result.authenticationToken).toBeTruthy();
        expect(result.refreshToken).toBeTruthy();
        done();
    });
});
