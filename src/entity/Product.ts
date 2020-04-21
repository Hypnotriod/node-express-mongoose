import mongoose, { Document } from 'mongoose';
import Discount from './Discount';

/**
 *
 * @author Ilya Pikin
 */

export default interface Product extends Document {
    name: string;
    type: string;
    price: number;
    inStockQuantity: number;
    reservedQuantity: number;
    isHidden: boolean;
    discounts?: [Discount['_id']];
}
