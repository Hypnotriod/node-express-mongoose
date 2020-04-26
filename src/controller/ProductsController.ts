import { Request, Response } from 'express';
import { Controller, Get, Post, Middleware } from '@overnightjs/core';
import { injectable, singleton } from 'tsyringe';
import { getJsonWebToken } from './middleware/JsonWebTokenMiddleware';
import ProductService from '../service/ProductService';
import ServerResponseResult from '../dto/ServerResponseResult';
import ProductsRequestResult from '../dto/ProductsRequestResult';

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
    @Middleware(getJsonWebToken)
    private async getAllProducts(request: Request, response: Response): Promise<void> {
        const result: ProductsRequestResult = await this.productService.getAllProducts(response.locals.jsonWebToken);
        response.status(result.httpStatusCode).json(result);
    }

    @Post('add')
    @Middleware(getJsonWebToken)
    private async addNewProduct(request: Request, response: Response): Promise<void> {
        const result: ServerResponseResult = await this.productService.addNewProduct(response.locals.jsonWebToken, request.body);
        response.status(result.httpStatusCode).json(result);
    }
}
