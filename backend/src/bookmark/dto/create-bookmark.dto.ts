import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBookmarkDto {
  @IsNumber()
  @IsOptional()
  categoryId: number; // when this is not present, the root categoryId is used

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  link: string;
}
