import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CategoryRepository } from './category.repository.ts';
import { SubscriptionsService } from '@src/subscriptions/subscriptions.service.js';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class CategoryService {
  constructor(
    @InjectPinoLogger(SubscriptionsService.name)
    private readonly logger: PinoLogger,
    private readonly repo: CategoryRepository,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    this.logger.info('Creating category in service');
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
