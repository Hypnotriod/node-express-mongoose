import { Request, Response } from 'express';
import { Controller, Get, Post, Middleware } from '@overnightjs/core';
import { injectable, singleton } from 'tsyringe';
import ProductService from '../service/ProductService';
import Product from '../entity/Product';
import { getJsonWebToken } from './middleware/JsonWebTokenMiddleware';

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
    @Middleware(getJsonWebToken)
    private async addNewProduct(request: Request, response: Response): Promise<void> {
        const product: Product | null = await this.productService.save(response.locals.jsonWebToken, request.body);
        response.json(product);
    }
}
