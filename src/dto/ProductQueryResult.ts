import { ProductUnits } from '../entity/Product';

/**
 *
 * @author Ilya Pikin
 */

export interface ReducedProductQueryResult {
    id: string;
    name: string;
    units: ProductUnits;
    type: string;
    price: number;
    currency: string;
    inStockQuantity: number;
    isFractional: boolean;
    description: string;
    discounts: object[];
}

export default interface ProductQueryResult extends ReducedProductQueryResult {
    reservedQuantity: number;
    isHidden: boolean;
    version: number;
    createdAt: string;
    updatedAt: string;
}
