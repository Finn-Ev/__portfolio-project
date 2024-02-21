import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto/';
import { CategoryService } from '../category/category.service';

@Injectable()
export class BookmarkService {
  constructor(
    private prismaService: PrismaService,
    private categoryService: CategoryService,
  ) {}

  async create(userId: number, dto: CreateBookmarkDto) {
    if (!dto.categoryId) {
      const { rootCategoryId } = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });

      dto.categoryId = rootCategoryId;
    } else {
      const correspondingCategory = await this.categoryService.findOne(userId, dto.categoryId);

      if (!correspondingCategory) throw new ForbiddenException();
    }

    return this.prismaService.bookmark.create({
      // @ts-expect-error when dto.categoryId is not provided, it has been set to the root category at this point
      data: {
        ...dto,
      },
    });
  }

  async findAllForCategory(userId: number, categoryId: number) {
    const correspondingCategory = await this.categoryService.findOne(userId, categoryId);

    if (!correspondingCategory) throw new ForbiddenException();

    const bookmarks = await this.prismaService.bookmark.findMany({
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
        return this.prismaService.bookmark.findMany({
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
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark) throw new NotFoundException();

    if (!(await this.checkIfUserOwnsBookmark(userId, bookmarkId))) throw new ForbiddenException();

    return bookmark;
  }

  async update(userId: number, bookmarkId: number, dto: UpdateBookmarkDto) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark) throw new NotFoundException();

    const correspondingCategory = await this.categoryService.findOne(userId, bookmark.categoryId);

    if (!correspondingCategory) throw new ForbiddenException();

    // if the category is being changed, check if the new category belongs to the user
    if (dto.categoryId && dto.categoryId !== bookmark.categoryId) {
      const newCategory = await this.categoryService.findOne(userId, dto.categoryId);

      if (!newCategory) throw new ForbiddenException();
    }

    return this.prismaService.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async remove(userId: number, bookmarkId: number) {
    if (!(await this.checkIfUserOwnsBookmark(userId, bookmarkId))) throw new ForbiddenException();

    await this.prismaService.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }

  // HELPER
  async checkIfUserOwnsBookmark(userId: number, bookmarkId: number) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    if (!bookmark) return false;

    const correspondingCategory = await this.prismaService.category.findUnique({
      where: { userId, id: bookmark.categoryId },
    });

    return !!correspondingCategory;
  }
}
