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
    return this.prisma.bookmark.create({
      data: {
        ...dto,
      },
    });
  }

  async findAllForCategory(userId: number, categoryId: number) {
    const correspondingCategory = await this.categoryService.findOne(userId, categoryId);

    if (!correspondingCategory) throw new ForbiddenException('Access to resources denied');

    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        categoryId,
      },
    });

    bookmarks.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return bookmarks;
  }

  async findAll(userId: number) {
    const userCategories = await this.categoryService.findAll(userId);

    const bookmarksInsideCategories = await Promise.all(
      userCategories.map(async (category) => {
        return this.prisma.bookmark.findMany({
          where: {
            categoryId: category.id,
          },
        });
      }),
    );

    const bookmarks = bookmarksInsideCategories.flat();

    bookmarks.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return bookmarks;
  }

  async findOne(userId: number, bookmarkId: number) {
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
