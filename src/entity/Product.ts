import { Document } from 'mongoose';
import Discount from './Discount';

/**
 *
 * @author Ilya Pikin
 */

export type ProductUnits = 'pcs' | 'kg' | 'gr' | 't' | 'l' | 'gal' | 'lb';

export default interface Product extends Document {
    name: string;
    units: ProductUnits;
    type: string;
    price: number;
    currency: string; // ISO-4217
    inStockQuantity: number;
    reservedQuantity: number;
    isFractional: boolean;
    isHidden: boolean;
    description?: string;
    discounts?: [Discount['_id']];
}
