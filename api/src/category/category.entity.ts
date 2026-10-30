import { UUID } from 'crypto';

export class Category {
  id: UUID;
  title: string;
  icon: string;
  color: string;
  userId: string; // Default UUID -> SYSTEM
}

export type NewCategory = Omit<Category, 'id'>;
