import { DatabaseService } from '@src/database/database.service.js';
import { NewCategory, Category } from './category.entity.ts';
import { CategoryRepository } from './category.repository.ts';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PgCategoryRepository extends CategoryRepository {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  async createCategory(data: NewCategory): Promise<Category> {
    const COLUMNS = `
        id,
        title,
        icon,
        color
    `;

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
