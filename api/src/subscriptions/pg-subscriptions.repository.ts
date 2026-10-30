import { Injectable } from '@nestjs/common';
import { NewSubscription, Subscription } from './subscription.entity.ts';
import { SubscriptionsRepository } from './subscriptions.repository.ts';
import { DatabaseService } from '@src/database/database.service.js';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { SubscriptionsService } from './subscriptions.service.ts';

@Injectable()
export class PgSubscriptionsRepository extends SubscriptionsRepository {
  constructor(
    @InjectPinoLogger(PgSubscriptionsRepository.name)
    private readonly logger: PinoLogger,
    private readonly database: DatabaseService,
  ) {
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
        description,
        category_id      AS "categoryId",
        user_id          AS "userId"
    `;

    this.logger.info(`creating subscription in repo : ${data}`);

    try {
      const rows = await this.database.query<Subscription>(
        `INSERT INTO subscriptions
       (title, price, currency, billing_interval, start_date, end_date, timezone, cycle, color, icon, description, category_id, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10,$11, $12, $13)
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
          data.categoryId ?? null,
          data.userId,
        ],
      );
      if (!rows[0]) {
        throw new Error('Insert did not return a subscription');
      }
      return rows[0]!;
    } catch (error) {
      this.logger.error(
        `error creating subscriptions : ${JSON.stringify(error)}`,
      );
      throw error;
    }
  }

  async getSubscriptions(userId: string): Promise<Array<Subscription>> {
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
        description,
        category_id      AS "categoryId"
    `;

    const rows = await this.database.query<Subscription>(`
      select ${COLUMNS} from subscriptions where user_id = $1
      `, [userId]);

    return rows;
  }
}
