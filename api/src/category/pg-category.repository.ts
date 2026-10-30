import { DatabaseService } from '@src/database/database.service.js';
import { NewCategory, Category } from './category.entity.ts';
import { CategoryRepository } from './category.repository.ts';
import { Injectable } from '@nestjs/common';
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
        (title, icon, color, user_id)
        values ($1, $2, $3, $4)
        returning ${COLUMNS}
        `,
      [data.title, data.icon, data.color, data.userId],
    );

    return rows[0]!;
  }

  async findAllCategories(userId: string): Promise<Array<Category>> {
    const rows = await this.database.query<Category>(`
      select id,title, icon, color from categories where user_id is null or user_id = $1
      `, [userId]);

    return rows;
  }
}
