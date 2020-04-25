import { singleton, injectable } from 'tsyringe';
import { JsonWebToken } from './JsonWebTokenService';
import { UserRole } from '../entity/User';
import Product from '../entity/Product';
import ProductRepository from '../repository/ProductRepository';
import UserService from './UserService';
import ServerResponseResult from '../dto/ServerResponseResult';
import HttpStatusCode from '../constants/HttpStatusCode';
import ServerErrorDescription from '../constants/ServerErrorDescription';
import ServerOperationErrorCode from '../constants/ServerOperationErrorCode';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
export default class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly userService: UserService) { }

    public async addNewProduct(jsonWebToken: JsonWebToken, data: any | Product): Promise<ServerResponseResult> {
        if (!jsonWebToken || !this.userService.checkRole(jsonWebToken.userRole, UserRole.STOREKEEPER)) {
            return {
                httpStatusCode: HttpStatusCode.FORBIDDEN,
                errorDescription: ServerErrorDescription.HAVE_NO_PERMISSION
            };
        }
        if (!await this.productRepository.save(data)) {
            return {
                httpStatusCode: HttpStatusCode.OK
            };
        } else {
            return {
                httpStatusCode: HttpStatusCode.OK,
                operationErrorCode: ServerOperationErrorCode.MALFORMED,
                errorDescription: ServerErrorDescription.MALFORMED
            };
        }
    }

    public findAll(): Promise<Product[]> {
        return this.productRepository.findAll();
    }
}