import { Request, Response } from 'express';
import { Controller, Post, Middleware } from '@overnightjs/core';
import { injectable, singleton } from 'tsyringe';
import { getUuid } from './middleware/JsonWebTokenMiddleware';
import UserService from '../service/UserService';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
@Controller('login')
export default class LoginController {
    constructor(private readonly userService: UserService) { }

    @Post()
    private async login(request: Request, response: Response): Promise<void> {
        const token: string | null = await this.userService.login(
            request.body.login,
            request.body.password);
        response.json(token);
    }
}
