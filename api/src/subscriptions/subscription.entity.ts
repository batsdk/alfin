import { BillingInterval } from '@src/contracts/index.js';
import { UUID } from 'node:crypto';

export interface Subscription {
  id: UUID;
  title: string;
  price: number;
  startDate: Date;
  endDate?: Date;
  billingInterval: BillingInterval;
  cycle: number;
  currency: string;
  timezone: string;
  color: string;
  description: string;
  icon?: string;
  categoryId?: UUID;
}

export type NewSubscription = Omit<Subscription, 'id'>;
