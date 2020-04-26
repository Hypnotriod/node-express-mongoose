import HttpStatusCode from '../constants/HttpStatusCode';
import SeverErrorDescription from '../constants/ServerErrorDescription';
import ServerOperationErrorCode from '../constants/ServerOperationErrorCode';

/**
 *
 * @author Ilya Pikin
 */

export default interface ServerResponseResult {
    httpStatusCode: HttpStatusCode;
    authorizationGranted: boolean;
    data?: object | object[];
    operationErrorCode?: ServerOperationErrorCode;
    errorDescription?: SeverErrorDescription;
}