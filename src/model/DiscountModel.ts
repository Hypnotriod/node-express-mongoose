import mongoose, { Schema } from 'mongoose';
import Discount from '../entity/Discount';

/**
 *
 * @author Ilya Pikin
 */

const schema: Schema = new Schema({
    discount: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    isActive: { type: Boolean, required: true },
    rule: {
        type: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export default mongoose.model<Discount>('discount', schema);