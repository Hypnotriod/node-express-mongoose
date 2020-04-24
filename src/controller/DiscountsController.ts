import { Request, Response } from 'express';
import { Controller, Get, Post } from '@overnightjs/core';
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
export default class DiscountsController {
    constructor(private readonly discountService: DiscountService) { }

    @Get()
    private async getAllDiscounts(request: Request, response: Response): Promise<void> {
        const discount: Discount[] = await this.discountService.findAll();
        response.json(discount);
    }

    @Post('add')
    private async addNewDiscount(request: Request, response: Response): Promise<void> {
        const discount: Discount | null = await this.discountService.save(request.body);
        response.json(discount);
    }
}
