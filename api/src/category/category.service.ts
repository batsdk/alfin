import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CategoryRepository } from './category.repository.ts';

@Injectable()
export class CategoryService {
  constructor(private readonly repo: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const res = await this.repo.createCategory({ ...createCategoryDto });
    return res;
  }

  findAll() {
    return `This action returns all category`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} category`;
  // }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} category`;
  // }
}
