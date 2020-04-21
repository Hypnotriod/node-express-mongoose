import mongoose, { Document } from 'mongoose';
import DiscountRule from './DiscountRule';

/**
 *
 * @author Ilya Pikin
 */

export default interface Discount extends Document {
    discount: number;
    rule: DiscountRule;
}