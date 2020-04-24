import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import JsonWebTokenService from '../../service/JsonWebTokenService';

/**
 *
 * @author Ilya Pikin
 */

export async function getUuid(request: Request, response: Response, next: NextFunction): Promise<void> {
    const jsonWebTokenService: JsonWebTokenService = container.resolve(JsonWebTokenService);
    if (request.headers.authorization) {
        request.body.uuid = await jsonWebTokenService.verify(request.headers.authorization);
    }
    next();
}
