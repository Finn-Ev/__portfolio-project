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

  async findAll(userId: number, includeBookmarks = true) {
    const categories = await this.prismaService.category.findMany({
      where: {
        userId,
      },
      include: {
        bookmarks: includeBookmarks,
      },
    });

    // move the root category to the end of the array
    const rootCategory = categories.find((category) => category.title === '__ROOT__');
    if (rootCategory) {
      const filteredCategories = categories.filter((category) => category.title !== '__ROOT__');
      filteredCategories.push(rootCategory);
      return filteredCategories;
    }

    return categories;
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

    // move the bookmarks to the root category before deleting the category
    await this.prismaService.bookmark.updateMany({
      where: {
        categoryId,
      },
      data: {
        categoryId: rootCategoryId,
      },
    });

    const allBookmarks = await this.prismaService.bookmark.findMany();
    console.log({ allBookmarks });

    return this.prismaService.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
