import { GlobalResponse } from '@src/contracts/global.response.js';
import { Subscription } from '../subscription.entity.ts';

export class SubscriptionResponse extends GlobalResponse {
  constructor(init: Partial<SubscriptionResponse>) {
    super();
    Object.assign(this, init);
  }
  subscription: Subscription;
}
