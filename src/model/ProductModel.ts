import mongoose, { Schema } from 'mongoose';
import Product from '../entity/Product';

/**
 *
 * @author Ilya Pikin
 */

const schema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
    },
    units: {
        type: String,
        required: true,
        lowercase: true,
        match: RegExp('^(pcs|kg|gr|t|l|gal|lb)$'),
    },
    type: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    currency: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        match: RegExp('^[A-Z]{3}$'),
    },
    inStockQuantity: {
        type: Number,
        required: true,
        min: 0,
    },
    reservedQuantity: {
        type: Number,
        required: true,
        min: 0,
    },
    isFractional: {
        type: Boolean,
        required: true,
    },
    isHidden: {
        type: Boolean,
        required: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
        minlength: 3,
    },
    discounts: {
        type: [Schema.Types.ObjectId],
        required: false,
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    },
});

export default mongoose.model<Product>('product', schema);
