import Repository from './Repository';
import Discount from '../entity/Discount';
import DiscountModel from '../model/DiscountModel';

/**
 *
 * @author Ilya Pikin
 */

export default class DiscountRepository extends Repository<Discount> {
    constructor() {
        super(DiscountModel);
    }
}