import { singleton, injectable } from 'tsyringe';
import DiscountRepository from '../repository/DiscountRepository';
import Discount from '../entity/Discount';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
export default class DiscountService {
    constructor(private readonly discountRepository: DiscountRepository) { }

    public save(data: any | Discount): Promise<Discount | null> {
        return this.discountRepository.save(data);
    }

    public findAll(): Promise<Discount[]> {
        return this.discountRepository.findAll();
    }
}
