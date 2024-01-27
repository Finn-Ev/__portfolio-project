import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async create(userId: number, dto: CreateCategoryDto) {
    return this.prismaService.category.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  findAll(userId: number) {
    return this.prismaService.category.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(userId: number, categoryId: number) {
    const category = await this.prismaService.category.findUnique({
      where: {
        userId,
        id: categoryId,
      },
    });

    if (!category) {
      throw new ForbiddenException();
    }

    return category;
  }

  async update(userId: number, categoryId: number, dto: UpdateCategoryDto) {
    const category = await this.prismaService.category.findUnique({
      where: {
        userId,
        id: categoryId,
      },
    });

    if (!category) throw new ForbiddenException();

    return this.prismaService.category.update({
      where: {
        id: category.id,
      },
      data: {
        ...dto,
      },
    });
  }

  async remove(userId: number, categoryId: number) {
    const category = await this.prismaService.category.findUnique({
      where: {
        userId,
        id: categoryId,
      },
    });

    if (!category) throw new ForbiddenException();

    return this.prismaService.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
