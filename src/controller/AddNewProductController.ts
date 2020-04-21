import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import { injectable, singleton } from 'tsyringe';
import ProductService from '../service/ProductService';
import Product from '../entity/Product';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
@Controller('products/add')
export default class AddNewProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    private async addNewProduct(request: Request, response: Response): Promise<void> {
        const product: Product = await this.productService.save(request.body);
        response.json(product);
    }
}
