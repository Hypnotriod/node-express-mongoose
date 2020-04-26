import { Request, Response } from 'express';
import { Controller, Post, Middleware } from '@overnightjs/core';
import { injectable, singleton } from 'tsyringe';
import { getJsonWebToken } from './middleware/JsonWebTokenMiddleware';
import UserAuthService from '../service/UserAuthService';
import ServerResponseResult from '../dto/ServerResponseResult';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
@Controller('auth')
export default class UserAuthController {
    constructor(private readonly userAuthService: UserAuthService) { }

    @Post('login')
    private async login(request: Request, response: Response): Promise<void> {
        const result: ServerResponseResult = await this.userAuthService.login(
            request.body.login,
            request.body.password);
        response.status(result.httpStatusCode).json(result);
    }

    @Post('logout')
    @Middleware(getJsonWebToken)
    private async logout(request: Request, response: Response): Promise<void> {
        const result: ServerResponseResult = await this.userAuthService.logout(
            response.locals.jsonWebToken);
        response.status(result.httpStatusCode).json(result);
    }

    @Post('refresh')
    private async refresh(request: Request, response: Response): Promise<void> {
        const result: ServerResponseResult = await this.userAuthService.refresh(
            request.body.refreshToken);
        response.status(result.httpStatusCode).json(result);
    }
}
