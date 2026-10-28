import { NewSubscription, Subscription } from './subscription.entity.js';

export abstract class SubscriptionsRepository {
  abstract createSubscription(data: NewSubscription): Promise<Subscription>;
}
