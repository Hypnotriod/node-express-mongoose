import Discount from './Discount';
import Entity from './Entity';

/**
 *
 * @author Ilya Pikin
 */

export type ProductUnits = 'pcs' | 'kg' | 'gr' | 't' | 'l' | 'gal' | 'lb';

export default interface Product extends Entity {
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
