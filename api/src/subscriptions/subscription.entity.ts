import { BillingInterval } from "@src/contracts/index.js";
import { UUID } from "node:crypto";

export interface Subscription {
    id: UUID;
    title: string;
    price: number;
    startDate: Date;
    endDate: Date;
    billingInterval: BillingInterval;
    currency: string;
    timezone: string;
}

export type NewSubscription = Omit<Subscription, 'id'>;