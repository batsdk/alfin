import { UUID } from 'crypto';

export class Category {
  id: UUID;
  title: string;
  icon: string;
  color: string;
}

export type NewCategory = Omit<Category, 'id'>;
