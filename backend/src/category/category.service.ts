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
      include: {
        bookmarks: true,
      },
    });
  }

  findAll(userId: number, includeBookmarks = true) {
    return this.prismaService.category.findMany({
      where: {
        userId,
      },
      include: {
        bookmarks: includeBookmarks,
      },
    });
  }

  async findOne(userId: number, categoryId: number, includeBookmarks = true) {
    const category = await this.prismaService.category.findUnique({
      where: {
        userId,
        id: categoryId,
      },
      include: {
        bookmarks: includeBookmarks,
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
      include: {
        bookmarks: true,
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

    if (!category) {
      throw new ForbiddenException('This category does not exist or does not belong to the user.');
    }

    const { rootCategoryId } = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (category.id === rootCategoryId) {
      throw new ForbiddenException("The user's root category cannot be deleted.");
    }

    if (!category) throw new ForbiddenException();

    // because of the cascading delete, the user's bookmarks will be deleted as well
    return this.prismaService.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
