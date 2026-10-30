import { NewSubscription, Subscription } from './subscription.entity.js';

export abstract class SubscriptionsRepository {
  abstract createSubscription(data: NewSubscription): Promise<Subscription>;
  abstract getSubscriptions(userId: string): Promise<Array<Subscription>>;
}
