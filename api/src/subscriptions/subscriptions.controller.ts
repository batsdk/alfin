import { Body, Controller, Post } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto.js';

@Controller('subscriptions')
export class SubscriptionsController {

    @Post()
    createSubscription(@Body() createSubscription : CreateSubscriptionDto) {
        console.log(createSubscription);
    }

}
