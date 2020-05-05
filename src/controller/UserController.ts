import { Request, Response } from 'express';
import { Controller, Post, Middleware, Delete, Get } from '@overnightjs/core';
import { injectable, singleton } from 'tsyringe';
import UserService from '../service/UserService';
import processJsonWebToken from './middleware/JsonWebTokenMiddleware';
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
    @Middleware(processJsonWebToken)
    private async getAllUsers(request: Request, response: Response): Promise<void> {
        const result: ServerResponseResult = await this.userService.getAllUsers(response.locals.jsonWebToken);
        response.status(result.httpStatusCode).json(result);
    }

    @Get('get/:id')
    @Middleware(processJsonWebToken)
    private async getUserById(request: Request, response: Response): Promise<void> {
        const result: ServerResponseResult = await this.userService.getUserById(
            response.locals.jsonWebToken,
            request.params.id);
        response.status(result.httpStatusCode).json(result);
    }

    @Post('add')
    @Middleware(processJsonWebToken)
    private async addNewUser(request: Request, response: Response): Promise<void> {
        const result: ServerResponseResult = await this.userService.addNewUser(
            response.locals.jsonWebToken,
            request.body);
        response.status(result.httpStatusCode).json(result);
    }

    @Post('delete')
    @Middleware(processJsonWebToken)
    private async deleteUser(request: Request, response: Response): Promise<void> {
        const result: ServerResponseResult = await this.userService.deleteUser(
            response.locals.jsonWebToken,
            request.body.userId);
        response.status(result.httpStatusCode).json(result);
    }

    @Post('set-active')
    @Middleware(processJsonWebToken)
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
            request.body.newPassword,
            request.body.newPasswordConfirm);
        response.status(result.httpStatusCode).json(result);
    }
}
