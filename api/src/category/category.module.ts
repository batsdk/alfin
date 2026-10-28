import { Module } from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { CategoryController } from './category.controller.js';
import { CategoryRepository } from './category.repository.ts';
import { PgCategoryRepository } from './pg-category.repository.ts';
import { DatabaseModule } from '@src/database/database.module.js';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    { provide: CategoryRepository, useClass: PgCategoryRepository },
  ],
  imports: [DatabaseModule],
})
export class CategoryModule {}
