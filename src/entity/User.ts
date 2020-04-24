import { Document } from 'mongoose';

/**
 *
 * @author Ilya Pikin
 */

export type UserRole = 'admin' | 'seller' | 'storekeeper';

export default interface User extends Document {
    login: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    description?: string;
}
