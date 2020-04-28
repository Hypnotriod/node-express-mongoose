import 'reflect-metadata';
import AuthorizationResult from '../../src/dto/AuthorizationResult';
import {
    ADMIN_USER_LOGIN,
    ADMIN_USER_PASS,
    INVALID_USER_LOGIN,
    INVALID_USER_PASS,
    USER_TO_LOGOUT_LOGIN,
    USER_TO_LOGOUT2_LOGIN,
    USER_TO_LOGOUT_PASS,
} from './ServicesTestEnvironment';
import HttpStatusCode from '../../src/constants/HttpStatusCode';
import UserAuthService from '../../src/service/UserAuthService';
import { container } from 'tsyringe';
import JsonWebTokenService, { JsonWebToken } from '../../src/service/JsonWebTokenService';

/**
 *
 * @author Ilya Pikin
 */

let userAuthService: UserAuthService;
let jsonWebTokenService: JsonWebTokenService;
beforeEach(() => {
    userAuthService = container.resolve(UserAuthService);
    jsonWebTokenService = container.resolve(JsonWebTokenService);
});

function waitMs(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(resolve.bind(this), ms);
    });
}

export default function authTests(): void {
    test('User should get authentication and refresh tokens on login, with valid creadentials', async done => {
        const result: AuthorizationResult = await userAuthService.login(ADMIN_USER_LOGIN, ADMIN_USER_PASS);
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

    test('User should not be able to login, with invalid login', async done => {
        const result: AuthorizationResult = await userAuthService.login(INVALID_USER_LOGIN, ADMIN_USER_PASS);
        expect(result.httpStatusCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(result.authorizationGranted).toBe(false);
        expect(result.authenticationToken).toBeUndefined();
        expect(result.refreshToken).toBeUndefined();
        done();
    });

    test('User should have possibility to refresh authentication token by refresh token', async done => {
        let result: AuthorizationResult = await userAuthService.login(ADMIN_USER_LOGIN, ADMIN_USER_PASS);
        result = await userAuthService.refresh(result.refreshToken);
        expect(result.httpStatusCode).toBe(HttpStatusCode.OK);
        expect(result.authorizationGranted).toBe(true);
        expect(result.authenticationToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
        done();
    });

    test('User should be able to logout', async done => {
        let result: AuthorizationResult = await userAuthService.login(USER_TO_LOGOUT_LOGIN, USER_TO_LOGOUT_PASS);
        const jsonWebToken: JsonWebToken | null = await jsonWebTokenService.verify(result.authenticationToken!);
        result = await userAuthService.logout(jsonWebToken!);
        expect(result.httpStatusCode).toBe(HttpStatusCode.OK);
        expect(result.authorizationGranted).toBe(true);
        done();
    });

    test('User should not be able to logout if authentication token has expired', async done => {
        let result: AuthorizationResult = await userAuthService.login(USER_TO_LOGOUT2_LOGIN, USER_TO_LOGOUT_PASS);
        await waitMs(1000);
        const jsonWebToken: JsonWebToken | null = await jsonWebTokenService.verify(result.authenticationToken!);
        result = await userAuthService.logout(jsonWebToken!);
        expect(result.httpStatusCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(result.authorizationGranted).toBe(false);
        done();
    });
}
