import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import JsonWebTokenService, { JsonWebToken } from '../../service/JsonWebTokenService';
import ServerResponseService from '../../service/ServerResponseService';
import ServerResponseResult from '../../dto/ServerResponseResult';

/**
 *
 * @author Ilya Pikin
 */

export default async function processJsonWebToken(request: Request, response: Response, next: NextFunction): Promise<void> {
    if (!request.headers.authorization) {
        next();
        return;
    }
    const jsonWebTokenService: JsonWebTokenService = container.resolve(JsonWebTokenService);
    const jsonWebToken: JsonWebToken | null = await jsonWebTokenService.verify(request.headers.authorization);
    if (jsonWebToken) {
        response.locals.jsonWebToken = jsonWebToken;
        next();
    } else {
        const serverResponseService: ServerResponseService = container.resolve(ServerResponseService);
        const result: ServerResponseResult = serverResponseService.generateUnauthorized();
        response.status(result.httpStatusCode).json(result);
    }
}
