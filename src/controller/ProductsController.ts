import { Request, Response } from 'express';
import { Controller, Get, Post } from '@overnightjs/core';
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
export default class ProductsController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    private async getAllProducts(request: Request, response: Response): Promise<void> {
        const products: Product[] = await this.productService.findAll();
        response.json(products);
    }

    @Post('add')
    private async addNewProduct(request: Request, response: Response): Promise<void> {
        const product: Product = await this.productService.save(request.body);
        response.json(product);
    }
}
