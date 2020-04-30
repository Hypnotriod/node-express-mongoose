import { Request, Response, NextFunction } from 'express';

/**
 *
 * @author Ilya Pikin
 */

export function setCorsHeaders(request: Request, response: Response, next: NextFunction): void {
    response.header('Access-Control-Allow-Origin', request.headers.host);
    response.header('Access-Control-Allow-Methods', 'GET, POST');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
}