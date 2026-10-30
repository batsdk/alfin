import { UUID } from "node:crypto";

// Mirrors the BillingInterval enum in api/src/contracts/subscriptions.types.ts
export type BillingInterval = "weekly" | "monthly" | "yearly";

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
