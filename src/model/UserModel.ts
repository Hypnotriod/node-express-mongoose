import mongoose, { Schema } from 'mongoose';
import User from '../entity/User';

/**
 *
 * @author Ilya Pikin
 */

const schema: Schema = new Schema({
    login: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    password: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true, match: RegExp('admin|seller|storekeeper') },
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export default mongoose.model<User>('user', schema);