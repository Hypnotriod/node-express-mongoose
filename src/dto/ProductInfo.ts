import { ProductUnits } from '../entity/Product';

/**
 *
 * @author Ilya Pikin
 */

export interface ReducedProductInfo {
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

export interface FullProductInfo extends ReducedProductInfo {
    reservedQuantity: number;
    isHidden: boolean;
    version: number;
    createdAt: string;
    updatedAt: string;
}
