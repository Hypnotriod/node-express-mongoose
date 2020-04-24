import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import JsonWebTokenService from '../../service/JsonWebTokenService';

/**
 *
 * @author Ilya Pikin
 */

export function getUuid(request: Request, response: Response, next: NextFunction): void {
    const jsonWebTokenService: JsonWebTokenService = container.resolve(JsonWebTokenService);
    request.body.uuid = jsonWebTokenService.verify(request.headers.authorization);
    next();
}
