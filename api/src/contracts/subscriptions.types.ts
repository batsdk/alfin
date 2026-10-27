export enum BillingInterval {
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export type Subscription = {
  title: string
  price: number
  startDate: Date
  endDate: Date
  billingInterval: BillingInterval
  currency: string
  timezone?: string
}