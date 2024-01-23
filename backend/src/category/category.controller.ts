import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { STATUS_CODES } from 'http';
import { GetUser } from '../auth/decorator/get-user.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(
    @GetUser('id') userId: number,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(userId, createCategoryDto);
  }

  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.categoryService.findAllFromUser(userId);
  }

  @Get(':id')
  findOne(
    @GetUser('id') userId,
    @Param('id', ParseIntPipe) categoryId: number,
  ) {
    return this.categoryService.findOneFromUser(userId, categoryId);
  }

  @Patch(':id')
  update(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(userId, categoryId, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) categoryId: number,
  ) {
    return this.categoryService.remove(userId, categoryId);
  }
}
