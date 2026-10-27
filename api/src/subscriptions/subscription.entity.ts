import { BillingInterval } from "@src/contracts/index.js";
import { UUID } from "node:crypto";

export interface Subscription {
    id: UUID;
    userId: string;
    name: string;
    amount: number; // minor units
    currency: string;
    interval: BillingInterval;
    nextChargeAt: Date;
}

export type NewSubscription = Omit<Subscription, 'id'>;