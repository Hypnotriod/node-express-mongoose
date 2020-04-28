import { Request, Response } from 'express';
import { Controller, Post, Middleware } from '@overnightjs/core';
import { injectable, singleton } from 'tsyringe';
import UserService from '../service/UserService';
import { getJsonWebToken } from './middleware/JsonWebTokenMiddleware';
import ServerResponseResult from '../dto/ServerResponseResult';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
@Controller('users')
export default class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('add')
    @Middleware(getJsonWebToken)
    private async addNewUser(request: Request, response: Response): Promise<void> {
        const result: ServerResponseResult = await this.userService.addNewUser(response.locals.jsonWebToken, request.body);
        response.status(result.httpStatusCode).json(result);
    }
}
