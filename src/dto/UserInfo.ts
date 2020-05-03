import { UserRole } from '../entity/User';

/**
 *
 * @author Ilya Pikin
 */

export interface UserInfo {
    id: string;
    login: string;
    role: UserRole;
    isActive: boolean;
    version: number;
    createdAt: string;
    updatedAt: string;
}
