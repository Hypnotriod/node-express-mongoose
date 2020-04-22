import Repository from './Repository';
import Discount from '../entity/Discount';
import DiscountModel from '../model/DiscountModel';
import { singleton } from 'tsyringe';

/**
 *
 * @author Ilya Pikin
 */

@singleton()
export default class DiscountRepository extends Repository<Discount> {
    constructor() {
        super(DiscountModel);
    }
}