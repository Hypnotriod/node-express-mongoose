import { Request, Response } from 'express';
import { Controller, Post, Middleware } from '@overnightjs/core';
import { injectable, singleton } from 'tsyringe';
import UserService from '../service/UserService';
import User from '../entity/User';
import { getUuid } from './middleware/JsonWebTokenMiddleware';

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
    @Middleware(getUuid)
    private async addNewUser(request: Request, response: Response): Promise<void> {
        const user: User = await this.userService.addNew(request.body.uuid, request.body);
        response.json(user);
    }
}
