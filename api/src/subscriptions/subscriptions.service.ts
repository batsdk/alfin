import { Injectable } from '@nestjs/common';
import { Subscription } from '@src/contracts/subscriptions.types.js';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class SubscriptionsService {

    constructor(@InjectPinoLogger(SubscriptionsService.name) private readonly logger: PinoLogger) { }


    async createSubscription(subs: Subscription) {
        this.logger.info("Returning in Subscription Service");
        return subs;
    }

}
