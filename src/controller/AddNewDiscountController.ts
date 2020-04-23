import { injectable, singleton } from 'tsyringe';
import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import Discount from '../entity/Discount';
import DiscountService from '../service/DiscountService';

@injectable()
@singleton()
@Controller('discounts/add')
export default class AddNewDiscountController {
    constructor(private readonly discountService: DiscountService) { }

    @Post()
    private async addNewDiscount(request: Request, response: Response): Promise<void> {
        const discount: Discount = await this.discountService.save(request.body);
        response.json(discount);
    }
}