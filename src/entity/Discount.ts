import DiscountRule from './DiscountRule';
import Entity from './Entity';

/**
 *
 * @author Ilya Pikin
 */

export default interface Discount extends Entity {
    discount: number;
    isActive: boolean;
    rule: DiscountRule;
}