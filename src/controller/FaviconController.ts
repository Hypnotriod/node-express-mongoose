import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { injectable, singleton } from 'tsyringe';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
@Controller('favicon.ico')
export default class FaviconController {
    constructor() { }

    @Get()
    private getFavicon(request: Request, response: Response): void {
        response.status(204).send();
    }
}
