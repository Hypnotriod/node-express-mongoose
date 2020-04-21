import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { injectable, singleton } from 'tsyringe';
import ProductService from '../service/ProductService';
import Product from '../entity/Product';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
@Controller('products')
export default class ShowAllProductsController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    private async getAllProducts(request: Request, response: Response): Promise<void> {
        const products: Product[] = await this.productService.findAll();
        response.json(products);
    }
}
