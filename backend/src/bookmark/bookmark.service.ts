import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto/';
import { CategoryService } from '../category/category.service';

@Injectable()
export class BookmarkService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
  ) {}

  async create(dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        ...dto,
      },
    });

    return bookmark;
  }

  async findAllForCategory(userId, categoryId: number) {
    const correspondingCategory = await this.categoryService.findOne(userId, categoryId);

    if (!correspondingCategory) throw new ForbiddenException('Access to resources denied');

    return this.prisma.bookmark.findMany({
      where: {
        categoryId,
      },
    });
  }

  async findAll(userId) {
    const userCategories = await this.categoryService.findAll(userId);

    const bookmarks = await Promise.all(
      userCategories.map(async (category) => {
        return await this.prisma.bookmark.findMany({
          where: {
            categoryId: category.id,
          },
        });
      }),
    );

    return bookmarks;
  }

  async findOne(userId, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark) throw new NotFoundException();

    const correspondingCategory = await this.categoryService.findOne(userId, bookmark.categoryId);

    if (!correspondingCategory) throw new ForbiddenException('Access to resources denied');

    return bookmark;
  }

  async update(userId: number, bookmarkId: number, dto: UpdateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark) throw new NotFoundException();

    const correspondingCategory = await this.categoryService.findOne(userId, bookmark.categoryId);

    if (!correspondingCategory) throw new ForbiddenException('Access to resources denied');

    return this.prisma.bookmark.update({
      where: {
        categoryId: bookmark.categoryId,
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async remove(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    const correspondingCategory = await this.categoryService.findOne(userId, bookmark.categoryId);

    if (!bookmark || !correspondingCategory) throw new ForbiddenException('Access to resources denied');

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
