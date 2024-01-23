import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto/';
import { CategoryService } from '../category/category.service';

@Injectable()
export class BookmarkService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
  ) {}

  async create(categoryId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        categoryId: categoryId,
        ...dto,
      },
    });

    return bookmark;
  }

  findAllFromCategory(categoryId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        categoryId,
      },
    });
  }

  findOneFromCategory(categoryId: number, bookmarkId: number) {
    return this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
        categoryId,
      },
    });
  }

  async update(userId: number, bookmarkId: number, dto: UpdateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark) throw new ForbiddenException('Access to resources denied');

    const correspondingCategory = await this.categoryService.findOneFromUser(userId, bookmark.categoryId);

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

    const correspondingCategory = await this.categoryService.findOneFromUser(userId, bookmark.categoryId);

    if (!bookmark || !correspondingCategory) throw new ForbiddenException('Access to resources denied');

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
