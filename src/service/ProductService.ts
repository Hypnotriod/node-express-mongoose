import { singleton, injectable } from 'tsyringe';
import { JsonWebToken } from './JsonWebTokenService';
import { UserRole } from '../entity/User';
import Product from '../entity/Product';
import ProductRepository from '../repository/ProductRepository';
import UserService from './UserService';
import ServerResponseResult from '../dto/ServerResponseResult';
import ServerResponseService from './ServerResponseService';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
export default class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly userService: UserService,
        private readonly serverResponseService: ServerResponseService) { }

    public async addNewProduct(jsonWebToken: JsonWebToken | undefined, data: any | Product): Promise<ServerResponseResult> {
        if (!jsonWebToken || !this.userService.checkRole(jsonWebToken.userRole, UserRole.STOREKEEPER)) {
            return this.serverResponseService.generateNoPermission(jsonWebToken !== undefined);
        }
        if (!await this.productRepository.save(data)) {
            return this.serverResponseService.generateOk();
        } else {
            return this.serverResponseService.generateMalformed();
        }
    }

    public async getAllProducts(jsonWebToken: JsonWebToken | undefined): Promise<ServerResponseResult> {
        const isStorekeeper: boolean = (jsonWebToken !== undefined && jsonWebToken.userRole === UserRole.STOREKEEPER);
        let products: Product[] = await this.productRepository.findAll();
        let reducedProducts: object[];

        reducedProducts = isStorekeeper
            ? products.map(this.mapToFullProductInfo.bind(this))
            : products.filter(product => !product.isHidden)
                .map(this.mapToReducedProductInfo.bind(this));

        return this.serverResponseService.generateOkWithData(jsonWebToken !== undefined, reducedProducts);
    }

    private mapToFullProductInfo(product: Product): object {
        return {
            ...this.mapToReducedProductInfo(product),
            reservedQuantity: product.reservedQuantity,
            isHidden: product.isHidden,
            version: product.__v,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
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
            discounts: product.discounts,
        };
    }
}