import { Request, Response } from 'express';
import { Controller, Get, Post } from '@overnightjs/core';
import { injectable, singleton } from 'tsyringe';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
@Controller('*')
export default class NotFoundController {
    constructor() { }

    @Get()
    private getNotFound(request: Request, response: Response): void {
        response.status(404).send();
    }

    @Post()
    private postNotFound(request: Request, response: Response): void {
        response.status(404).send();
    }
}
