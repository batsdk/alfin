import { NewSubscription, Subscription } from "./subscription.entity.js";

export abstract class SubscriptionsRepository {
    abstract insert(data: NewSubscription): Promise<Subscription>;
}