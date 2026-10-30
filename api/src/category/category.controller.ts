import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CurrentUserId } from '@src/auth/current-user-id.decorator.js';

@Controller('category')
export class CategoryController {
  constructor(
    @InjectPinoLogger(CategoryController.name)
    private readonly logger: PinoLogger,
    private readonly categoryService: CategoryService,
  ) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUserId() userId: string) {
    this.logger.info('Request recieved');
    return this.categoryService.create(createCategoryDto, userId);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('test')
  test() {
    return 'ok';
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.categoryService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
  //   return this.categoryService.update(+id, updateCategoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.categoryService.remove(+id);
  // }
}
