import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import { injectable, singleton } from 'tsyringe';
import UserService from '../service/UserService';
import User from '../entity/User';

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
    private async addNewUser(request: Request, response: Response): Promise<void> {
        const user: User = await this.userService.save(request.body);
        response.json(user);
    }
}
