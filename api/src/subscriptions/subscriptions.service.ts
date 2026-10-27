import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CreateSubscriptionDto } from './dto/create-subscription.dto.js';
import { SubscriptionsRepository } from './subscriptions.repository.js';
import { BillingInterval } from '@src/contracts/subscriptions.types.js';

@Injectable()
export class SubscriptionsService {

    constructor(
        @InjectPinoLogger(SubscriptionsService.name) private readonly logger: PinoLogger,
        private readonly repo: SubscriptionsRepository
    ) { }


    async createSubscription(subs: CreateSubscriptionDto) {
        this.logger.info("Returning in Subscription Service");
        this.repo.insert({
            name: 'something',
            amount: 100,
            currency: "LKR",
            interval: 'weekly' as BillingInterval,
            nextChargeAt: new Date(),
            userId: 'stringtwotwo'

        })
        return subs;
    }

}
