import { singleton, injectable } from 'tsyringe';
import { JsonWebToken } from './JsonWebTokenService';
import { UserRole } from '../entity/User';
import Product from '../entity/Product';
import ProductRepository from '../repository/ProductRepository';
import ServerResponseResult from '../dto/ServerResponseResult';
import ServerResponseService from './ServerResponseService';
import AllowUserRoles from './decorator/AllowUserRoles';
import ProductQueryResult, { ReducedProductQueryResult } from '../dto/ProductQueryResult';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
export default class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly serverResponseService: ServerResponseService) { }

    @AllowUserRoles([UserRole.STOREKEEPER])
    public async addNewProduct(jsonWebToken: JsonWebToken | undefined, data: any | Product): Promise<ServerResponseResult> {
        data._id = undefined;
        if (!await this.productRepository.validate(data)) {
            return this.serverResponseService.generateBadRequest();
        }
        if (!await this.productRepository.save(data)) {
            return this.serverResponseService.generateConflict();
        }
        return this.serverResponseService.generateOk();
    }

    public async getProductById(jsonWebToken: JsonWebToken | undefined, productId: string): Promise<ServerResponseResult> {
        const isStorekeeper: boolean = (jsonWebToken !== undefined && jsonWebToken.userRole === UserRole.STOREKEEPER);
        const product: Product | null = await this.productRepository.findById(productId);
        let queryResultProduct: object | null;
        if (product === null || (product.isHidden && !isStorekeeper)) {
            queryResultProduct = null;
        } else {
            queryResultProduct = isStorekeeper
                ? this.mapToFullProductInfo(product)
                : this.mapToReducedProductInfo(product);
        }
        return this.serverResponseService.generateOkWithData(jsonWebToken !== undefined, queryResultProduct);
    }

    public async getAllProducts(jsonWebToken: JsonWebToken | undefined): Promise<ServerResponseResult> {
        const isStorekeeper: boolean = (jsonWebToken !== undefined && jsonWebToken.userRole === UserRole.STOREKEEPER);
        const products: Product[] = await this.productRepository.findAll();
        const queryResultProducts: object[] = isStorekeeper
            ? products.map(this.mapToFullProductInfo.bind(this))
            : products.filter(product => !product.isHidden)
                .map(this.mapToReducedProductInfo.bind(this));

        return this.serverResponseService.generateOkWithData(jsonWebToken !== undefined, queryResultProducts);
    }

    private mapToFullProductInfo(product: Product): ProductQueryResult {
        return {
            ...this.mapToReducedProductInfo(product),
            reservedQuantity: product.reservedQuantity,
            isHidden: product.isHidden,
            version: product.__v!,
            createdAt: product.createdAt!,
            updatedAt: product.updatedAt!,
        };
    }

    private mapToReducedProductInfo(product: Product): ReducedProductQueryResult {
        return {
            id: product._id,
            name: product.name,
            units: product.units,
            type: product.type,
            price: product.price,
            currency: product.currency,
            inStockQuantity: product.inStockQuantity,
            isFractional: product.isFractional,
            description: product.description || '',
            discounts: product.discounts || [],
        };
    }
}