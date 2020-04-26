import ServerResponseResult from './ServerResponseResult';

/**
 *
 * @author Ilya Pikin
 */

export default interface ProductsRequestResult extends ServerResponseResult {
    products: object[];
}
