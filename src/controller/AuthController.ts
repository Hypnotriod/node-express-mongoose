import { Request, Response } from 'express';
import { Controller, Post, Middleware } from '@overnightjs/core';
import { injectable, singleton } from 'tsyringe';
import UserService from '../service/UserService';
import AuthorizationResult from '../dto/AuthorizationResult';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
@Controller('auth')
export default class AuthController {
    constructor(private readonly userService: UserService) { }

    @Post('login')
    private async login(request: Request, response: Response): Promise<void> {
        const result: AuthorizationResult | null = await this.userService.login(
            request.body.login,
            request.body.password);
        response.status(result.httpStatusCode).json(result);
    }
}
