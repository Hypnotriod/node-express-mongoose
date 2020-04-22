import mongoose, { Document } from 'mongoose';
import DiscountRule from './DiscountRule';

/**
 *
 * @author Ilya Pikin
 */

export default interface Discount extends Document {
    discount: number;
    isActive: boolean;
    rule: DiscountRule;
}