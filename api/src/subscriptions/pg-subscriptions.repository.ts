import { Injectable } from '@nestjs/common';
import { NewSubscription, Subscription } from './subscription.entity.ts';
import { SubscriptionsRepository } from './subscriptions.repository.ts';
import { DatabaseService } from '@src/database/database.service.js';

@Injectable()
export class PgSubscriptionsRepository extends SubscriptionsRepository {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  async createSubscription(data: NewSubscription): Promise<Subscription> {
    const COLUMNS = `
        id,
        title,
        price,
        currency,
        billing_interval AS "billingInterval",
        start_date       AS "startDate",
        end_date         AS "endDate",
        timezone,
        cycle,
        color,
        icon,
        description
    `;

    const rows = await this.database.query<Subscription>(
      `INSERT INTO subscriptions
       (title, price, currency, billing_interval, start_date, end_date, timezone, cycle, color, icon, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10,$11)
        RETURNING ${COLUMNS}`,
      [
        data.title,
        data.price,
        data.currency,
        data.billingInterval,
        data.startDate,
        data.endDate ?? null,
        data.timezone ?? null,
        data.cycle ?? null,
        data.color ?? null,
        data.icon ?? null,
        data.description ?? null,
      ],
    );
    return rows[0]!;
  }
}
