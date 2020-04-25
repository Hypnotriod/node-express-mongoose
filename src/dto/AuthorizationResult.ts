import ServerResponseResult from './ServerResponseResult';

/**
 *
 * @author Ilya Pikin
 */

export default interface AuthorizationResult extends ServerResponseResult {
    authenticationToken?: string;
    refreshToken?: string;
}

