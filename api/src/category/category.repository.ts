import { Category, NewCategory } from './category.entity.ts';

export abstract class CategoryRepository {
  abstract createCategory(data: NewCategory): Promise<Category>;
}
