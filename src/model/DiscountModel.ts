import mongoose, { Schema } from 'mongoose';
import Discount from '../entity/Discount';
/**
 *
 * @author Ilya Pikin
 */

const schema: Schema = new Schema({
    discount: { type: String, required: true },
    rule: {
        type: { type: String, required: true },
    }
});

export default mongoose.model<Discount>('discount', schema);