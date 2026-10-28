import { DatabaseService } from '@src/database/database.service.js';
import { NewCategory, Category } from './category.entity.ts';
import { CategoryRepository } from './category.repository.ts';
import { Injectable } from '@nestjs/common';
import { SubscriptionsService } from '@src/subscriptions/subscriptions.service.js';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class PgCategoryRepository extends CategoryRepository {
  constructor(
    @InjectPinoLogger(PgCategoryRepository.name)
    private readonly logger: PinoLogger,
    private readonly database: DatabaseService,
  ) {
    super();
  }

  async createCategory(data: NewCategory): Promise<Category> {
    const COLUMNS = `
        id,
        title,
        icon,
        color
    `;

    this.logger.info(`creating category in the repo : ${data}`);

    const rows = await this.database.query<Category>(
      ` insert into categories
        (title, icon, color)
        values ($1, $2, $3)
        returning ${COLUMNS}
        `,
      [data.title, data.icon, data.color],
    );

    return rows[0]!;
  }
}
