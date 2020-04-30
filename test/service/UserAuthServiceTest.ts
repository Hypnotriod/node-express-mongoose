import 'reflect-metadata';
import AuthorizationResult from '../../src/dto/AuthorizationResult';
import {
    ADMIN_USER_LOGIN,
    VALID_USER_PASS,
    INVALID_USER_LOGIN,
    INVALID_USER_PASS,
    USER_TO_LOGOUT_LOGIN,
    USER_TO_LOGOUT2_LOGIN,
    INVALID_REFRESH_TOKEN,
    USER_TO_DELETE_LOGIN,
    INACTIVE_USER_LOGIN,
    ACTIVE_USER_LOGIN,
} from './ServicesTestEnvironment';
import HttpStatusCode from '../../src/constants/HttpStatusCode';
import UserAuthService from '../../src/service/UserAuthService';
import { container } from 'tsyringe';
import JsonWebTokenService, { JsonWebToken } from '../../src/service/JsonWebTokenService';
import UserRepository from '../../src/repository/UserRepository';
import User from '../../src/entity/User';

/**
 *
 * @author Ilya Pikin
 */

let userAuthService: UserAuthService;
let jsonWebTokenService: JsonWebTokenService;
let userRepository: UserRepository;
beforeEach(() => {
    userAuthService = container.resolve(UserAuthService);
    jsonWebTokenService = container.resolve(JsonWebTokenService);
    userRepository = container.resolve(UserRepository);
});

function waitMs(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(resolve.bind(this), ms);
    });
}

export default function authTests(): void {
    test('User should get authentication and refresh tokens on login, with valid creadentials', async done => {
        const result: AuthorizationResult = await userAuthService.login(ADMIN_USER_LOGIN, VALID_USER_PASS);
        expect(result.httpStatusCode).toBe(HttpStatusCode.OK);
        expect(result.authorizationGranted).toBe(true);
        expect(result.authenticationToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
        done();
    });

    test('User should not be able to login, with invalid password', async done => {
        const result: AuthorizationResult = await userAuthService.login(ADMIN_USER_LOGIN, INVALID_USER_PASS);
        expect(result.httpStatusCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(result.authorizationGranted).toBe(false);
        expect(result.authenticationToken).toBeUndefined();
        expect(result.refreshToken).toBeUndefined();
        done();
    });

    test('User should not be able to login, if user is not active', async done => {
        const result: AuthorizationResult = await userAuthService.login(INACTIVE_USER_LOGIN, INVALID_USER_PASS);
        expect(result.httpStatusCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(result.authorizationGranted).toBe(false);
        expect(result.authenticationToken).toBeUndefined();
        expect(result.refreshToken).toBeUndefined();
        done();
    });

    test('User should not be able to login, with invalid login', async done => {
        const result: AuthorizationResult = await userAuthService.login(INVALID_USER_LOGIN, VALID_USER_PASS);
        expect(result.httpStatusCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(result.authorizationGranted).toBe(false);
        expect(result.authenticationToken).toBeUndefined();
        expect(result.refreshToken).toBeUndefined();
        done();
    });

    test('User should not be able to login, with undefined password or login', async done => {
        let result: AuthorizationResult = await userAuthService.login(undefined, VALID_USER_PASS);
        expect(result.httpStatusCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(result.authorizationGranted).toBe(false);
        expect(result.authenticationToken).toBeUndefined();
        expect(result.refreshToken).toBeUndefined();

        result = await userAuthService.login(ADMIN_USER_LOGIN, undefined);
        expect(result.httpStatusCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(result.authorizationGranted).toBe(false);
        expect(result.authenticationToken).toBeUndefined();
        expect(result.refreshToken).toBeUndefined();
        done();
    });

    test('User should have possibility to refresh authentication token by refresh token', async done => {
        let result: AuthorizationResult = await userAuthService.login(ADMIN_USER_LOGIN, VALID_USER_PASS);
        result = await userAuthService.refresh(result.refreshToken);
        expect(result.httpStatusCode).toBe(HttpStatusCode.OK);
        expect(result.authorizationGranted).toBe(true);
        expect(result.authenticationToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
        done();
    });

    test('User should not be able to refresh authentication token if user was deleted', async done => {
        let result: AuthorizationResult = await userAuthService.login(USER_TO_DELETE_LOGIN, VALID_USER_PASS);
        const user: User | null = await userRepository.findByLogin(USER_TO_DELETE_LOGIN);
        await userRepository.delete(user!);
        result = await userAuthService.refresh(result.refreshToken);
        expect(result.httpStatusCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(result.authorizationGranted).toBe(false);
        expect(result.authenticationToken).toBeUndefined();
        expect(result.refreshToken).toBeUndefined();
        done();
    });

    test('User should not be able to refresh authentication token if user has become inactive', async done => {
        let result: AuthorizationResult = await userAuthService.login(ACTIVE_USER_LOGIN, VALID_USER_PASS);
        const user: User | null = await userRepository.findByLogin(ACTIVE_USER_LOGIN);
        user!.isActive = false;
        await userRepository.save(user!);
        result = await userAuthService.refresh(result.refreshToken);
        expect(result.httpStatusCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(result.authorizationGranted).toBe(false);
        expect(result.authenticationToken).toBeUndefined();
        expect(result.refreshToken).toBeUndefined();
        done();
    });

    test('User should not be able to refresh authentication token by invalid refresh token', async done => {
        let result: AuthorizationResult = await userAuthService.refresh(INVALID_REFRESH_TOKEN);
        expect(result.httpStatusCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(result.authorizationGranted).toBe(false);
        expect(result.authenticationToken).toBeUndefined();
        expect(result.refreshToken).toBeUndefined();
        done();
    });

    test('User should not be able to refresh authentication token by undefined refresh token', async done => {
        let result: AuthorizationResult = await userAuthService.refresh(undefined);
        expect(result.httpStatusCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(result.authorizationGranted).toBe(false);
        expect(result.authenticationToken).toBeUndefined();
        expect(result.refreshToken).toBeUndefined();
        done();
    });

    test('User should be able to logout', async done => {
        let result: AuthorizationResult = await userAuthService.login(USER_TO_LOGOUT_LOGIN, VALID_USER_PASS);
        const jsonWebToken: JsonWebToken | null = await jsonWebTokenService.verify(result.authenticationToken!);
        result = await userAuthService.logout(jsonWebToken!);
        expect(result.httpStatusCode).toBe(HttpStatusCode.OK);
        expect(result.authorizationGranted).toBe(true);
        done();
    });

    test('User should not be able to logout if authentication token has expired', async done => {
        let result: AuthorizationResult = await userAuthService.login(USER_TO_LOGOUT2_LOGIN, VALID_USER_PASS);
        await waitMs(1000);
        const jsonWebToken: JsonWebToken | null = await jsonWebTokenService.verify(result.authenticationToken!);
        result = await userAuthService.logout(jsonWebToken!);
        expect(result.httpStatusCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(result.authorizationGranted).toBe(false);
        done();
    });
}
