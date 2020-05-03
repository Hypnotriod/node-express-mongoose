import mongoose, { Schema } from 'mongoose';
import User from '../entity/User';

/**
 *
 * @author Ilya Pikin
 */

const schema: Schema = new Schema({
    login: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 20,
        match: RegExp('^([a-z]+[a-z0-9]+\.?[a-z0-9]+)$'),
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
        match: RegExp('^(admin|seller|storekeeper)$'),
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
        minlength: 3,
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    },
});

export default mongoose.model<User>('user', schema);
