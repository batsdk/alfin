import { Injectable } from "@nestjs/common";
import { NewSubscription, Subscription } from "./subscription.entity.js";
import { SubscriptionsRepository } from "./subscriptions.repository.js";


@Injectable()
export class PgSubscriptionsRepository extends SubscriptionsRepository {
    insert(data: NewSubscription): Promise<Subscription> {
        return Promise.resolve({
            ...data,
            id: crypto.randomUUID(),
        });
    }
}