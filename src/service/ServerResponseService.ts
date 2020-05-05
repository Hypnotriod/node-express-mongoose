import { singleton, injectable } from 'tsyringe';
import ServerResponseResult from '../dto/ServerResponseResult';
import HttpStatusCode from '../constants/HttpStatusCode';
import SeverErrorDescription from '../constants/ServerErrorDescription';
import AuthorizationResult from '../dto/AuthorizationResult';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
export default class ServerResponseService {
    constructor() { }

    public generateOk(authorizationGranted: boolean = true): ServerResponseResult {
        return {
            httpStatusCode: HttpStatusCode.OK,
            authorizationGranted,
        };
    }

    public generateOkWithData(authorizationGranted: boolean = true, data: object | object[] | null): ServerResponseResult {
        return {
            httpStatusCode: HttpStatusCode.OK,
            authorizationGranted,
            data,
        };
    }

    public generateAuthorized(authenticationToken: string, refreshToken: string): AuthorizationResult {
        return {
            httpStatusCode: HttpStatusCode.OK,
            authorizationGranted: true,
            authenticationToken,
            refreshToken,
        };
    }

    public generateBadRequest(authorizationGranted: boolean = true): ServerResponseResult {
        return {
            httpStatusCode: HttpStatusCode.BAD_REQUEST,
            errorDescription: SeverErrorDescription.BAD_REQUEST,
            authorizationGranted,
        };
    }
    public generateUnauthorized(): ServerResponseResult {
        return {
            httpStatusCode: HttpStatusCode.UNAUTHORIZED,
            errorDescription: SeverErrorDescription.UNAUTHORIZED,
            authorizationGranted: false,
        };
    }

    public generateForbidden(authorizationGranted: boolean = false): ServerResponseResult {
        return {
            httpStatusCode: HttpStatusCode.FORBIDDEN,
            errorDescription: SeverErrorDescription.FORBIDDEN,
            authorizationGranted,
        };
    }

    public generateConflict(authorizationGranted: boolean = true): ServerResponseResult {
        return {
            httpStatusCode: HttpStatusCode.CONFLICT,
            errorDescription: SeverErrorDescription.CONLICT,
            authorizationGranted,
        };
    }
}
