import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from '../../bookmark.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CategoryService } from '../../../category/category.service';
import { CreateBookmarkDto } from '../../dto';

describe('BookmarkService', () => {
  let bookmarkService: BookmarkService;
  let prismaService: PrismaService;

  let mainUserId: number;
  let mainCategoryId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, BookmarkService, PrismaService, CategoryService],
    }).compile();

    bookmarkService = module.get<BookmarkService>(BookmarkService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    const mainUser = await prismaService.user.create({
      data: {
        pwHash: '#hash#',
        email: 'test@example.com',
      },
    });

    mainUserId = mainUser.id;

    const mainCategory = await prismaService.category.create({
      data: {
        userId: mainUser.id,
        title: 'Test Category',
      },
    });

    mainCategoryId = mainCategory.id;
  });

  afterEach(async () => {
    await prismaService.cleanDatabase();
  });

  describe('create', () => {
    it('should create a new bookmark', async () => {
      const bookmarkDto: CreateBookmarkDto = {
        categoryId: mainCategoryId,
        title: 'New Bookmark',
        link: 'https://example.com/new-bookmark',
      };

      const { id: newBookmarkId } = await bookmarkService.create(bookmarkDto);

      const newBookmark = await prismaService.bookmark.findUnique({
        where: { id: newBookmarkId },
      });

      expect(newBookmark).toBeDefined();
      expect(newBookmark.categoryId).toBe(mainCategoryId);
      expect(newBookmark.title).toBe(bookmarkDto.title);
      expect(newBookmark.link).toBe(bookmarkDto.link);
    });
  });

  describe('findAllFromCategory', () => {
    it('should return an array of bookmarks', async () => {
      prismaService.bookmark.deleteMany(); // delete the category created in beforeEach to avoid confusion

      const newBookmarkData = [
        {
          categoryId: mainCategoryId,
          title: 'Bookmark 1',
          link: 'https://example.com/bookmark1',
        },
        {
          categoryId: mainCategoryId,
          title: 'Bookmark 2',
          link: 'https://example.com/bookmark2',
        },
      ];

      await prismaService.bookmark.createMany({
        data: newBookmarkData,
      });

      const bookmarks = await bookmarkService.findAllForCategory(mainUserId, mainCategoryId);

      expect(Array.isArray(bookmarks)).toBe(true);
      expect(bookmarks.length).toBe(2); // 2 from beforeEach + 1 from the beforeEach-method

      expect(bookmarks[0].categoryId).toBe(mainCategoryId);
      expect(bookmarks[1].categoryId).toBe(mainCategoryId);

      expect(bookmarks[0].title).toBe(newBookmarkData[0].title);
      expect(bookmarks[1].title).toBe(newBookmarkData[1].title);

      expect(bookmarks[0].link).toBe(newBookmarkData[0].link);
      expect(bookmarks[1].link).toBe(newBookmarkData[1].link);
    });

    it('should throw ForbiddenException if category does not belong to the user', async () => {
      const otherUser = await prismaService.user.create({
        data: {
          email: 'other@user.de',
          pwHash: 'password',
        },
      });

      const createdCategory = await prismaService.category.create({
        data: {
          userId: otherUser.id,
          title: 'Test Category',
        },
      });

      await expect(bookmarkService.findAllForCategory(mainUserId, createdCategory.id)).rejects.toThrowError(
        ForbiddenException,
      );
    });
  });

  describe('findOneFromCategory', () => {
    it('should return the bookmark with the specified ID', async () => {
      const createdBookmark = await prismaService.bookmark.create({
        data: {
          categoryId: mainCategoryId,
          title: 'Test Bookmark',
          link: 'https://example.com/bookmark',
        },
      });

      const bookmark = await bookmarkService.findOne(mainUserId, createdBookmark.id);

      expect(bookmark).toBeDefined();
      expect(bookmark.id).toBe(createdBookmark.id);
    });

    it('should throw ForbiddenException if bookmark does not belong to the user', async () => {
      const otherUser = await prismaService.user.create({
        data: {
          email: 'other@user.de',
          pwHash: 'password',
        },
      });

      const createdBookmark = await prismaService.bookmark.create({
        data: {
          categoryId: mainCategoryId,
          title: 'Test Bookmark',
          link: 'https://example.com/bookmark',
        },
      });

      await expect(bookmarkService.findOne(otherUser.id, createdBookmark.id)).rejects.toThrowError(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('should edit the bookmark with the specified ID', async () => {
      const originalBookmark = await prismaService.bookmark.create({
        data: {
          categoryId: mainCategoryId,
          title: 'Test Bookmark',
          link: 'https://example.com/bookmark',
        },
      });

      const editBookmarkDto = {
        title: 'Updated Bookmark',
        link: 'https://example.com/updated-bookmark',
      };

      await bookmarkService.update(mainUserId, originalBookmark.id, editBookmarkDto);

      const editedBookmark = await prismaService.bookmark.findUnique({
        where: { id: originalBookmark.id },
      });

      expect(editedBookmark).toBeDefined();
      expect(editedBookmark!.id).toBe(originalBookmark.id);
      expect(editedBookmark!.title).toBe(editBookmarkDto.title);
      expect(editedBookmark!.link).toBe(editBookmarkDto.link);
    });

    it('should throw ForbiddenException if bookmark does not belong to the user', async () => {
      const secondUser = await prismaService.user.create({
        data: {
          email: 'new@user.de',
          pwHash: '#hash#',
        },
      });

      const categoryFromTheSecondCategory = await prismaService.category.create({
        data: {
          userId: secondUser.id,
          title: 'A Category of the second user',
        },
      });

      const bookmarkFromTheSecondUser = await prismaService.bookmark.create({
        data: {
          categoryId: categoryFromTheSecondCategory.id,
          title: 'Test Bookmark',
          link: 'https://example.com/bookmark',
        },
      });

      const editBookmarkDto = {
        title: 'Updated Bookmark',
        link: 'https://example.com/updated-bookmark',
      };

      await expect(
        bookmarkService.update(mainUserId, bookmarkFromTheSecondUser.id, editBookmarkDto),
      ).rejects.toThrowError(ForbiddenException);

      const hopefullyNotEditedBookmark = await prismaService.bookmark.findUnique({
        where: { id: bookmarkFromTheSecondUser.id },
      });

      expect(hopefullyNotEditedBookmark!.id).toBe(bookmarkFromTheSecondUser.id);
      expect(hopefullyNotEditedBookmark!.title).toBe(bookmarkFromTheSecondUser.title);
      expect(hopefullyNotEditedBookmark!.link).toBe(bookmarkFromTheSecondUser.link);
    });
  });

  describe('remove', () => {
    it('should delete the bookmark with the specified ID', async () => {
      const createdBookmark = await prismaService.bookmark.create({
        data: {
          categoryId: mainCategoryId,
          title: 'Test Bookmark',
          link: 'https://example.com/bookmark',
        },
      });

      await bookmarkService.remove(mainUserId, createdBookmark.id);

      const deletedBookmark = await prismaService.bookmark.findUnique({
        where: {
          id: createdBookmark.id,
        },
      });

      expect(deletedBookmark).toBeNull();
    });

    it('should throw ForbiddenException if user does not own the bookmark', async () => {
      const secondUser = await prismaService.user.create({
        data: {
          email: 'new@user.de',
          pwHash: '#hash#',
        },
      });

      const categoryFromTheSecondCategory = await prismaService.category.create({
        data: {
          userId: secondUser.id,
          title: 'A Category of the second user',
        },
      });

      const bookmarkFromTheSecondUser = await prismaService.bookmark.create({
        data: {
          categoryId: categoryFromTheSecondCategory.id,
          title: 'Test Bookmark',
          link: 'https://example.com/bookmark',
        },
      });

      const currentBookmarkCount = await prismaService.bookmark.count();

      await expect(bookmarkService.remove(mainUserId, bookmarkFromTheSecondUser.id)).rejects.toThrow(
        ForbiddenException,
      );

      const newBookmarkCount = await prismaService.bookmark.count();

      expect(newBookmarkCount).toBe(currentBookmarkCount);
    });
  });
});
