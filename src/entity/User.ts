import { Document } from 'mongoose';

/**
 *
 * @author Ilya Pikin
 */

export enum UserRole {
    ADMIN = 'admin',
    SELLER = 'seller',
    STOREKEEPER = 'storekeeper'
}

export default interface User extends Document {
    login: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    description?: string;
}
