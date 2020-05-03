import Entity from './Entity';

/**
 *
 * @author Ilya Pikin
 */

export enum UserRole {
    ADMIN = 'admin',
    SELLER = 'seller',
    STOREKEEPER = 'storekeeper',
}

export default interface User extends Entity {
    login: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    description?: string;
}
