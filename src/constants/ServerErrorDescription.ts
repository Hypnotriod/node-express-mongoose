/**
 *
 * @author Ilya Pikin
 */

enum SeverErrorDescription {
    BAD_REQUEST = 'The request could not be understood by the server due to malformed syntax.',
    UNAUTHORIZED = 'Authorisation fail.',
    FORBIDDEN = 'Forbidden to access.',
    CONLICT = 'The request could not be completed due to a conflict with the current state of the resource.',
}

export default SeverErrorDescription;
