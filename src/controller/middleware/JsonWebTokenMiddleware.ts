import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import JsonWebTokenService, { JsonWebToken } from '../../service/JsonWebTokenService';

/**
 *
 * @author Ilya Pikin
 */

export async function getJsonWebToken(request: Request, response: Response, next: NextFunction): Promise<void> {
    const jsonWebTokenService: JsonWebTokenService = container.resolve(JsonWebTokenService);
    if (request.headers.authorization) {
        const jsonWebToken: JsonWebToken | null = await jsonWebTokenService.verify(request.headers.authorization);
        if (jsonWebToken) {
            response.locals.jsonWebToken = jsonWebToken;
        }
    }
    next();
}
