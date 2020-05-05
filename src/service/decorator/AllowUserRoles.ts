import { UserRole } from '../../entity/User';
import ServerResponseResult from '../../dto/ServerResponseResult';
import { JsonWebToken } from '../JsonWebTokenService';
import { container } from 'tsyringe';
import ServerResponseService from '../ServerResponseService';

/**
 *
 * @author Ilya Pikin
 */

export default function AllowUserRoles(permittedRoles: UserRole[]): any {
    return (target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
        return {
            value: function (...args: any[]): ServerResponseResult {
                const jsonWebToken: JsonWebToken | undefined = args[0];
                if (!jsonWebToken || !jsonWebToken.userRole || !permittedRoles.includes(jsonWebToken.userRole)) {
                    const serverResponseService: ServerResponseService = container.resolve(ServerResponseService);
                    return serverResponseService.generateForbidden(jsonWebToken !== undefined);
                }
                return descriptor.value.apply(this, args);
            },
        };
    };
}
