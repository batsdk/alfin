import { Category, NewCategory } from './category.entity.ts';

export abstract class CategoryRepository {
  abstract createCategory(data: NewCategory): Promise<Category>;
  abstract findAllCategories(userId: string): Promise<Array<Category>>;
}
