import { Body, Controller, HttpCode, HttpStatus, Post, Res, Response } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto.js';
import { SubscriptionsService } from './subscriptions.service.js';

@Controller('subscriptions')
export class SubscriptionsController {

    constructor(
        private readonly subsService: SubscriptionsService
    ) { }

    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createSubscription(@Body() createSubscription: CreateSubscriptionDto) {

        const res = await this.subsService.createSubscription(createSubscription);
        console.log(createSubscription);
        return res
    }

}
