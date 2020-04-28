import setupEnvironment from '../SetupEnvironment';
import ServerApplication from '../../src/application/ServerApplication';
import setupDatabase from '../SetupDatabase';
import UserAuthService from '../../src/service/UserAuthService';
import AuthorizationResult from '../../src/dto/AuthorizationResult';
import {
    USER_LOGIN_ADMIN,
    USER_PASS_ADMIN,
    USER_LOGIN_INVALID,
    USER_PASS_INVALID
} from '../constants/Constants';
import HttpStatusCode from '../../src/constants/HttpStatusCode';
import { container } from 'tsyringe';

/**
 *
 * @author Ilya Pikin
 */

let serverApplication: ServerApplication;
let userAuthService: UserAuthService;

beforeAll(async done => {
    serverApplication = await setupEnvironment();
    await setupDatabase();
    userAuthService = container.resolve(UserAuthService);
    done();
});

afterAll(async done => {
    await serverApplication.terminate();
    done();
});

describe('User authorization & authentication', () => {

    test('User should get authentication and refresh tokens on login, with valid creadentials', async done => {
        const result: AuthorizationResult = await userAuthService.login(USER_LOGIN_ADMIN, USER_PASS_ADMIN);
        expect(result.httpStatusCode).toBe(HttpStatusCode.OK);
        expect(result.authorizationGranted).toBe(true);
        expect(result.authenticationToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
        done();
    });

    test('User should not be able to login, with invalid password', async done => {
        const result: AuthorizationResult = await userAuthService.login(USER_LOGIN_ADMIN, USER_PASS_INVALID);
        expect(result.httpStatusCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(result.authorizationGranted).toBe(false);
        expect(result.authenticationToken).toBeUndefined();
        expect(result.refreshToken).toBeUndefined();
        done();
    });

    test('User should not be able to login, with invalid login', async done => {
        const result: AuthorizationResult = await userAuthService.login(USER_LOGIN_INVALID, USER_PASS_ADMIN);
        expect(result.httpStatusCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(result.authorizationGranted).toBe(false);
        expect(result.authenticationToken).toBeUndefined();
        expect(result.refreshToken).toBeUndefined();
        done();
    });

    test('User should not be able to login, with undefined login', async done => {
        const result: AuthorizationResult = await userAuthService.login(undefined, USER_PASS_ADMIN);
        expect(result.httpStatusCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(result.authorizationGranted).toBe(false);
        expect(result.authenticationToken).toBeUndefined();
        expect(result.refreshToken).toBeUndefined();
        done();
    });

    test('User should not be able to login, with undefined password', async done => {
        const result: AuthorizationResult = await userAuthService.login(USER_LOGIN_ADMIN, undefined);
        expect(result.httpStatusCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(result.authorizationGranted).toBe(false);
        expect(result.authenticationToken).toBeUndefined();
        expect(result.refreshToken).toBeUndefined();
        done();
    });
});
