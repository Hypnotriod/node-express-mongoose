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
import ProductsRequestResult from '../dto/ProductsRequestResult';

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

    public async addNewProduct(jsonWebToken: JsonWebToken | null, data: any | Product): Promise<ServerResponseResult> {
        if (!jsonWebToken || !this.userService.checkRole(jsonWebToken.userRole, UserRole.STOREKEEPER)) {
            return {
                httpStatusCode: HttpStatusCode.FORBIDDEN,
                errorDescription: ServerErrorDescription.HAVE_NO_PERMISSION,
                authorizationGranted: false
            };
        }
        if (!await this.productRepository.save(data)) {
            return {
                httpStatusCode: HttpStatusCode.OK,
                authorizationGranted: true
            };
        } else {
            return {
                httpStatusCode: HttpStatusCode.OK,
                operationErrorCode: ServerOperationErrorCode.MALFORMED,
                errorDescription: ServerErrorDescription.MALFORMED,
                authorizationGranted: true
            };
        }
    }

    public async getAllProducts(jsonWebToken: JsonWebToken | null): Promise<ProductsRequestResult> {
        const isStorekeeper: boolean = (jsonWebToken != null && jsonWebToken.userRole === UserRole.STOREKEEPER);
        let products: Product[] = await this.productRepository.findAll();
        let reducedProducts: object[];

        reducedProducts = isStorekeeper
            ? products.map(this.mapToFullProductInfo.bind(this))
            : products.filter(product => !product.isHidden)
                .map(this.mapToReducedProductInfo.bind(this));

        return {
            httpStatusCode: HttpStatusCode.OK,
            authorizationGranted: jsonWebToken != null,
            products: reducedProducts,
        };
    }

    private mapToFullProductInfo(product: Product): object {
        return {
            ...this.mapToReducedProductInfo(product),
            reservedQuantity: product.reservedQuantity,
            isHidden: product.isHidden,
            version: product.__v,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };
    }

    private mapToReducedProductInfo(product: Product): object {
        return {
            id: product._id,
            name: product.name,
            units: product.units,
            type: product.type,
            price: product.price,
            currency: product.currency,
            inStockQuantity: product.inStockQuantity,
            isFractional: product.isFractional,
            description: product.description,
            discounts: product.discounts
        };
    }
}