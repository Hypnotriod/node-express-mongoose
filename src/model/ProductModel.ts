import mongoose, { Schema } from 'mongoose';
import Product from '../entity/Product';

/**
 *
 * @author Ilya Pikin
 */

const schema: Schema = new Schema({
    name: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    type: { type: String, required: true, trim: true, minlength: 3 },
    price: { type: Number, required: true, min: 0 },
    inStockQuantity: { type: Number, required: true, min: 0 },
    reservedQuantity: { type: Number, required: true, min: 0 },
    isHidden: { type: Boolean, required: true },
    discounts: { type: [Schema.Types.ObjectId], required: false },
});

export default mongoose.model<Product>('product', schema);