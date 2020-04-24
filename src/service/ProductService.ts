import { singleton, injectable } from 'tsyringe';
import { JsonWebToken } from './JsonWebTokenService';
import { UserRole } from '../entity/User';
import Product from '../entity/Product';
import ProductRepository from '../repository/ProductRepository';
import UserService from './UserService';

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

    public async save(jsonWebToken: JsonWebToken, data: any | Product): Promise<Product | null> {
        if (!jsonWebToken || !this.userService.checkRole(jsonWebToken.userRole, UserRole.STOREKEEPER)) {
            return null;
        }
        return this.productRepository.save(data);
    }

    public findAll(): Promise<Product[]> {
        return this.productRepository.findAll();
    }
}