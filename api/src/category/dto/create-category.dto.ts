import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  title: string;

  @IsString()
  icon: string;

  @IsString()
  color: string;
}
