import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from '../../bookmark.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

describe('BookmarkService', () => {
  let bookmarkService: BookmarkService;
  let prismaService: PrismaService;

  let mainUserId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, BookmarkService, PrismaService],
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
  });

  afterEach(async () => {
    await prismaService.cleanDatabase();
  });

  describe('getBookmarks', () => {
    it('should return an array of bookmarks', async () => {
      await prismaService.bookmark.createMany({
        data: [
          {
            userId: mainUserId,
            title: 'Bookmark 1',
            link: 'https://example.com/bookmark1',
          },
          {
            userId: mainUserId,
            title: 'Bookmark 2',
            link: 'https://example.com/bookmark2',
          },
        ],
      });

      const bookmarks = await bookmarkService.findAll(mainUserId);

      expect(Array.isArray(bookmarks)).toBe(true);
      expect(bookmarks.length).toBe(2);

      expect(bookmarks[0].userId).toBe(mainUserId);
      expect(bookmarks[1].userId).toBe(mainUserId);

      expect(bookmarks[0].title).toBe('Bookmark 1');
      expect(bookmarks[1].title).toBe('Bookmark 2');

      expect(bookmarks[0].link).toBe('https://example.com/bookmark1');
      expect(bookmarks[1].link).toBe('https://example.com/bookmark2');
    });
  });

  describe('getBookmarkById', () => {
    it('should return the bookmark with the specified ID', async () => {
      const createdBookmark = await prismaService.bookmark.create({
        data: {
          userId: mainUserId,
          title: 'Test Bookmark',
          link: 'https://example.com/bookmark',
        },
      });

      const bookmark = await bookmarkService.findOne(
        mainUserId,
        createdBookmark.id,
      );

      expect(bookmark).toBeDefined();
      expect(bookmark.id).toBe(createdBookmark.id);
    });
  });

  describe('createBookmark', () => {
    it('should create a new bookmark', async () => {
      const bookmarkDto = {
        title: 'New Bookmark',
        link: 'https://example.com/new-bookmark',
      };

      const { id: newBookmarkId } = await bookmarkService.create(
        mainUserId,
        bookmarkDto,
      );

      const newBookmark = await prismaService.bookmark.findUnique({
        where: { id: newBookmarkId },
      });

      expect(newBookmark).toBeDefined();
      expect(newBookmark.userId).toBe(mainUserId);
      expect(newBookmark.title).toBe(bookmarkDto.title);
      expect(newBookmark.link).toBe(bookmarkDto.link);
    });
  });

  describe('editBookmarkById', () => {
    it('should edit the bookmark with the specified ID', async () => {
      const originalBookmark = await prismaService.bookmark.create({
        data: {
          userId: mainUserId,
          title: 'Test Bookmark',
          link: 'https://example.com/bookmark',
        },
      });

      const editBookmarkDto = {
        title: 'Updated Bookmark',
        link: 'https://example.com/updated-bookmark',
      };

      await bookmarkService.update(
        mainUserId,
        originalBookmark.id,
        editBookmarkDto,
      );

      const editedBookmark = await prismaService.bookmark.findUnique({
        where: { id: originalBookmark.id },
      });

      expect(editedBookmark).toBeDefined();
      expect(editedBookmark!.id).toBe(originalBookmark.id);
      expect(editedBookmark!.title).toBe(editBookmarkDto.title);
      expect(editedBookmark!.link).toBe(editBookmarkDto.link);
    });

    it('should throw ForbiddenException if user does not own the bookmark', async () => {
      const secondUser = await prismaService.user.create({
        data: {
          pwHash: '#hash#',
          email: 'test2@example.com',
        },
      });

      const createdBookmark = await prismaService.bookmark.create({
        data: {
          userId: secondUser.id,
          title: 'Test Bookmark',
          link: 'https://example.com/bookmark',
        },
      });

      const editBookmarkDto = {
        title: 'Updated Bookmark',
        link: 'https://example.com/updated-bookmark',
      };

      await expect(
        bookmarkService.update(mainUserId, createdBookmark.id, editBookmarkDto),
      ).rejects.toThrowError(ForbiddenException);

      const hopefullyNotEditedBookmark =
        await prismaService.bookmark.findUnique({
          where: { id: createdBookmark.id },
        });

      expect(hopefullyNotEditedBookmark!.id).toBe(createdBookmark.id);
      expect(hopefullyNotEditedBookmark!.title).toBe(createdBookmark.title);
      expect(hopefullyNotEditedBookmark!.link).toBe(createdBookmark.link);
    });
  });

  describe('deleteBookmarkById', () => {
    it('should delete the bookmark with the specified ID', async () => {
      const createdBookmark = await prismaService.bookmark.create({
        data: {
          userId: mainUserId,
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
          pwHash: '#hash#',
          email: 'test2@example.com',
        },
      });

      const createdBookmark = await prismaService.bookmark.create({
        data: {
          userId: secondUser.id,
          title: 'Test Bookmark',
          link: 'https://example.com/bookmark',
        },
      });

      const currentBookmarkCount = await prismaService.bookmark.count();

      await expect(
        bookmarkService.remove(mainUserId, createdBookmark.id),
      ).rejects.toThrow(ForbiddenException);

      const newBookmarkCount = await prismaService.bookmark.count();

      expect(newBookmarkCount).toBe(currentBookmarkCount);
    });
  });
});
