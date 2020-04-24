import { singleton, injectable } from 'tsyringe';
import Product from '../entity/Product';
import ProductRepository from '../repository/ProductRepository';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
export default class ProductService {
    constructor(private readonly productRepository: ProductRepository) { }

    public save(data: any | Product): Promise<Product | null> {
        return this.productRepository.save(data);
    }

    public findAll(): Promise<Product[]> {
        return this.productRepository.findAll();
    }
}