import { Request, Response } from 'express';
import { Controller, Post, Middleware, Delete, Get } from '@overnightjs/core';
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

    @Get()
    @Middleware(getJsonWebToken)
    private async getAllUsers(request: Request, response: Response): Promise<void> {
        const result: ServerResponseResult = await this.userService.getAllUsers(response.locals.jsonWebToken);
        response.status(result.httpStatusCode).json(result);
    }

    @Post('add')
    @Middleware(getJsonWebToken)
    private async addNewUser(request: Request, response: Response): Promise<void> {
        const result: ServerResponseResult = await this.userService.addNewUser(
            response.locals.jsonWebToken,
            request.body);
        response.status(result.httpStatusCode).json(result);
    }

    @Post('delete')
    @Middleware(getJsonWebToken)
    private async deleteUser(request: Request, response: Response): Promise<void> {
        const result: ServerResponseResult = await this.userService.deleteUser(
            response.locals.jsonWebToken,
            request.body.userId);
        response.status(result.httpStatusCode).json(result);
    }

    @Post('set-active')
    @Middleware(getJsonWebToken)
    private async updateUserActiveState(request: Request, response: Response): Promise<void> {
        const result: ServerResponseResult = await this.userService.setUserActiveState(
            response.locals.jsonWebToken,
            request.body.userId,
            request.body.isActive);
        response.status(result.httpStatusCode).json(result);
    }

    @Post('change-password')
    private async changeUserPassword(request: Request, response: Response): Promise<void> {
        const result: ServerResponseResult = await this.userService.changeUserPassword(
            request.body.login,
            request.body.oldPassword,
            request.body.newPassword);
        response.status(result.httpStatusCode).json(result);
    }
}
