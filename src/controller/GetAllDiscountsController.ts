import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { injectable, singleton } from 'tsyringe';
import DiscountService from '../service/DiscountService';
import Discount from '../entity/Discount';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
@Controller('discounts')
export default class GetAllDiscountsController {
    constructor(private readonly discountService: DiscountService) { }

    @Get()
    private async getAllProducts(request: Request, response: Response): Promise<void> {
        const discount: Discount[] = await this.discountService.findAll();
        response.json(discount);
    }
}
