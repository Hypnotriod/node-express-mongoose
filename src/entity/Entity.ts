import mongoose, { Document } from 'mongoose';

/**
 *
 * @author Ilya Pikin
 */

export default interface Entity extends Document {
    __v?: number;
    createdAt?: string;
    updatedAt?: string;
}
