import { singleton, injectable } from 'tsyringe';
import ServerResponseResult from '../dto/ServerResponseResult';
import HttpStatusCode from '../constants/HttpStatusCode';
import SeverErrorDescription from '../constants/ServerErrorDescription';
import AuthorizationResult from '../dto/AuthorizationResult';
import ServerOperationErrorCode from '../constants/ServerOperationErrorCode';

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

    public generateOkWithData(authorizationGranted: boolean = true, data: object | object[] = {}): ServerResponseResult {
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

    public generateMalformed(authorizationGranted: boolean = true): ServerResponseResult {
        return {
            httpStatusCode: HttpStatusCode.PARTIAL_CONTENT,
            operationErrorCode: ServerOperationErrorCode.MALFORMED,
            errorDescription: SeverErrorDescription.MALFORMED,
            authorizationGranted,
        };
    }

    public generateNoPermission(authorizationGranted: boolean): ServerResponseResult {
        return {
            httpStatusCode: HttpStatusCode.FORBIDDEN,
            errorDescription: SeverErrorDescription.NO_PERMISSION,
            authorizationGranted,
        };
    }

    public generateForbidden(authorizationGranted: boolean): ServerResponseResult {
        return {
            httpStatusCode: HttpStatusCode.FORBIDDEN,
            errorDescription: SeverErrorDescription.FORBIDDEN,
            authorizationGranted,
        };
    }
}
