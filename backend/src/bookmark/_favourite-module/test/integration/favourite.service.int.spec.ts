import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from '../../../bookmark.service';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CategoryService } from '../../../../category/category.service';
import { FavouriteService } from '../../favourite.service';
import { ForbiddenException } from '@nestjs/common';

type relevantBookmarkData = {
  id: number;
  isFavourite: boolean;
};

describe('CategoryService', () => {
  let favouriteService: FavouriteService;
  let prismaService: PrismaService;

  let mainUserId: number;
  let mainCategoryId: number;
  let bookmarks: relevantBookmarkData[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, BookmarkService, PrismaService, CategoryService, FavouriteService],
    }).compile();

    favouriteService = module.get<FavouriteService>(FavouriteService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeAll(async () => {
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

    await prismaService.bookmark.createMany({
      data: [
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
      ],
    });

    bookmarks = await prismaService.bookmark.findMany({
      where: { categoryId: mainCategoryId },
    });
  });

  afterAll(async () => {
    await prismaService.cleanDatabase();
  });

  describe('setFavourite', () => {
    it('should set a bookmark as favourite', async () => {
      await favouriteService.setFavourite(mainUserId, bookmarks[0].id, true);

      const updatedBookmark = await prismaService.bookmark.findUnique({
        where: { id: bookmarks[0].id },
      });

      expect(updatedBookmark).toBeDefined();
      expect(updatedBookmark.isFavourite).toBe(true);
    });

    it('should unset a bookmark as favourite', async () => {
      await favouriteService.setFavourite(mainUserId, bookmarks[0].id, false);

      const updatedBookmark = await prismaService.bookmark.findUnique({
        where: { id: bookmarks[0].id },
      });

      expect(updatedBookmark).toBeDefined();
      expect(updatedBookmark.isFavourite).toBe(false);
    });

    it('should throw an error if the bookmark does not exist', async () => {
      const invalidBookmarkId = 999999;

      await expect(favouriteService.setFavourite(mainUserId, invalidBookmarkId, true)).rejects.toThrowError(
        ForbiddenException,
      );
    });

    it('should throw an error if the bookmark does not belong to the user', async () => {
      const bookmark = await prismaService.bookmark.findFirst({
        where: { categoryId: mainCategoryId }, // belongs to main user
      });

      const secondaryUser = await prismaService.user.create({
        data: {
          pwHash: '#hash#',
          email: 'other@user.de',
        },
      });

      await expect(favouriteService.setFavourite(secondaryUser.id, bookmark.id, true)).rejects.toThrowError(
        ForbiddenException,
      );
    });
  });

  describe('getFavourites', () => {
    it('should get no favourites of the user', async () => {
      const favourites = await favouriteService.getFavourites(mainUserId);

      expect(favourites).toBeDefined();
      expect(favourites.length).toBe(0);
    });

    it('should get all favourites of the user', async () => {
      // set a first favourite
      await favouriteService.setFavourite(mainUserId, bookmarks[0].id, true);

      const favourites = await favouriteService.getFavourites(mainUserId);

      expect(favourites).toBeDefined();
      expect(favourites.length).toBe(1);

      // set another favourite
      await favouriteService.setFavourite(mainUserId, bookmarks[1].id, true);

      const updatedFavourites = await favouriteService.getFavourites(mainUserId);

      expect(updatedFavourites).toBeDefined();
      expect(updatedFavourites.length).toBe(2);
    });
  });
});
