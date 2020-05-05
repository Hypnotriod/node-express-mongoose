import { Request, Response } from 'express';
import { Controller, Get, Post, Middleware } from '@overnightjs/core';
import { injectable, singleton } from 'tsyringe';
import processJsonWebToken from './middleware/JsonWebTokenMiddleware';
import ProductService from '../service/ProductService';
import ServerResponseResult from '../dto/ServerResponseResult';

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
    @Middleware(processJsonWebToken)
    private async getAllProducts(request: Request, response: Response): Promise<void> {
        const result: ServerResponseResult = await this.productService.getAllProducts(response.locals.jsonWebToken);
        response.status(result.httpStatusCode).json(result);
    }

    @Post('add')
    @Middleware(processJsonWebToken)
    private async addNewProduct(request: Request, response: Response): Promise<void> {
        const result: ServerResponseResult = await this.productService.addNewProduct(response.locals.jsonWebToken, request.body);
        response.status(result.httpStatusCode).json(result);
    }

    @Get('get/:id')
    @Middleware(processJsonWebToken)
    private async getProductById(request: Request, response: Response): Promise<void> {
        const result: ServerResponseResult = await this.productService.getProductById(
            response.locals.jsonWebToken,
            request.params.id);
        response.status(result.httpStatusCode).json(result);
    }
}
