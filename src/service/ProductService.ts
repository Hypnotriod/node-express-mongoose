import { singleton, injectable } from 'tsyringe';
import Product from '../entity/Product';
import ProductRepository from '../repository/ProductRepository';

@injectable()
@singleton()
export default class ProductService {
    constructor(private readonly productRepository: ProductRepository) { }

    public async create(data: any): Promise<Product | null> {
        return this.productRepository.save(data);
    }

    public async getAll(): Promise<Product[]> {
        return this.productRepository.getAll();
    }
}