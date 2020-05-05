import { Request, Response, NextFunction } from 'express';

/**
 *
 * @author Ilya Pikin
 */

export default function processCorsHeaders(request: Request, response: Response, next: NextFunction): void {
    response.header('Access-Control-Allow-Origin', request.headers.origin);
    response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
}