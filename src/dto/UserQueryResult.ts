import { UserRole } from '../entity/User';

/**
 *
 * @author Ilya Pikin
 */

export default interface UserQueryResult {
    id: string;
    login: string;
    role: UserRole;
    isActive: boolean;
    version: number;
    createdAt: string;
    updatedAt: string;
}
