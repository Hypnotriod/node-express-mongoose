import { Document } from 'mongoose';

/**
 *
 * @author Ilya Pikin
 */

export default class RefreshToken extends Document {
    userId: string;
    token: string;
}