import mongoose, { Schema } from 'mongoose';
import Product from '../entity/Product';

/**
 *
 * @author Ilya Pikin
 */

const schema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    inStockQuantity: { type: Number, required: true },
    reservedQuantity: { type: Number, required: true },
    isHidden: { type: Boolean, required: true },
    discounts: { type: [Schema.Types.ObjectId], required: false },
});

export default mongoose.model<Product>('product', schema);