import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from '../../bookmark.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

describe('BookmarkService', () => {
  let bookmarkService: BookmarkService;
  let prismaService: PrismaService;
  let userId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookmarkService, PrismaService],
    }).compile();

    bookmarkService = module.get<BookmarkService>(BookmarkService);
    prismaService = module.get<PrismaService>(PrismaService);

    const user = await prismaService.user.create({
      data: {
        pwHash: '#hash#',
        email: 'test@example.com',
      },
    });

    userId = user.id;
  });

  afterEach(async () => {
    await prismaService.cleanDatabase();
  });

  describe('getBookmarks', () => {
    it('should return an array of bookmarks', async () => {
      await prismaService.bookmark.createMany({
        data: [
          {
            userId,
            title: 'Bookmark 1',
            link: 'https://example.com/bookmark1',
          },
          {
            userId,
            title: 'Bookmark 2',
            link: 'https://example.com/bookmark2',
          },
        ],
      });

      const bookmarks = await bookmarkService.getBookmarks(userId);

      expect(Array.isArray(bookmarks)).toBe(true);
      expect(bookmarks.length).toBe(2);

      expect(bookmarks[0].userId).toBe(userId);
      expect(bookmarks[1].userId).toBe(userId);

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
          userId,
          title: 'Test Bookmark',
          link: 'https://example.com/bookmark',
        },
      });

      const bookmark = await bookmarkService.getBookmarkById(
        userId,
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

      const { id: newBookmarkId } = await bookmarkService.createBookmark(
        userId,
        bookmarkDto,
      );

      const newBookmark = await prismaService.bookmark.findUnique({
        where: { id: newBookmarkId },
      });

      expect(newBookmark).toBeDefined();
      expect(newBookmark.userId).toBe(userId);
      expect(newBookmark.title).toBe(bookmarkDto.title);
      expect(newBookmark.link).toBe(bookmarkDto.link);
    });
  });

  describe('editBookmarkById', () => {
    it('should edit the bookmark with the specified ID', async () => {
      const originalBookmark = await prismaService.bookmark.create({
        data: {
          userId,
          title: 'Test Bookmark',
          link: 'https://example.com/bookmark',
        },
      });

      const editBookmarkDto = {
        title: 'Updated Bookmark',
        link: 'https://example.com/updated-bookmark',
      };

      await bookmarkService.editBookmarkById(
        userId,
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
      const createdBookmark = await prismaService.bookmark.create({
        data: {
          userId: userId + 1,
          title: 'Test Bookmark',
          link: 'https://example.com/bookmark',
        },
      });

      const editBookmarkDto = {
        title: 'Updated Bookmark',
        link: 'https://example.com/updated-bookmark',
      };

      await expect(
        bookmarkService.editBookmarkById(
          userId,
          createdBookmark.id,
          editBookmarkDto,
        ),
      ).rejects.toThrowError(ForbiddenException);
    });
  });

  describe('deleteBookmarkById', () => {
    it('should delete the bookmark with the specified ID', async () => {
      const createdBookmark = await prismaService.bookmark.create({
        data: {
          userId,
          title: 'Test Bookmark',
          link: 'https://example.com/bookmark',
        },
      });

      await bookmarkService.deleteBookmarkById(userId, createdBookmark.id);

      const deletedBookmark = await prismaService.bookmark.findUnique({
        where: {
          id: createdBookmark.id,
        },
      });

      expect(deletedBookmark).toBeNull();
    });

    it('should throw ForbiddenException if user does not own the bookmark', async () => {
      const foreignUserId = userId + 1;

      const createdBookmark = await prismaService.bookmark.create({
        data: {
          userId: foreignUserId,
          title: 'Test Bookmark',
          link: 'https://example.com/bookmark',
        },
      });

      await expect(
        bookmarkService.deleteBookmarkById(userId, createdBookmark.id),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
