import mongoose, { Schema } from 'mongoose';
import RefreshToken from '../entity/RefreshToken';

/**
 *
 * @author Ilya Pikin
 */

const schema: Schema = new Schema({
    userId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

export default mongoose.model<RefreshToken>('refresh_token', schema);
