import HttpStatusCode from '../constants/HttpStatusCode';
import SeverErrorDescription from '../constants/ServerErrorDescription';

/**
 *
 * @author Ilya Pikin
 */

export default interface ServerResponseResult {
    httpStatusCode: HttpStatusCode;
    authorizationGranted: boolean;
    data?: object | object[];
    errorDescription?: SeverErrorDescription;
}