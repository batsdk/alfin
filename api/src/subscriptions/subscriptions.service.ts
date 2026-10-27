import { Injectable } from '@nestjs/common';
import { Subscription } from '@src/contracts/subscriptions.types.js';

@Injectable()
export class SubscriptionsService {


    async createSubscription(subs: Subscription){
        console.log("Something..")
        return subs;
    }

}
