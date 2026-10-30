import { UUID } from "node:crypto";

export interface Subscription {
  id: UUID;
  title: string;
  price: number;
  startDate: Date;
  endDate?: Date;
  billingInterval: any;
  cycle: number;
  currency: string;
  timezone: string;
  color: string;
  description: string;
  icon?: string;
  categoryId?: UUID;
}
