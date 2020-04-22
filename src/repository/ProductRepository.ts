import { singleton } from 'tsyringe';
import Repository from './Repository';
import ProductModel from '../model/ProductModel';
import Product from '../entity/Product';

/**
 *
 * @author Ilya Pikin
 */

@singleton()
export default class ProductRepository extends Repository<Product> {
    constructor() {
        super(ProductModel);
    }
}