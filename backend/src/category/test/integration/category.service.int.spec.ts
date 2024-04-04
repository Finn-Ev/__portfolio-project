import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../../category.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dto';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let prismaService: PrismaService;

  let mainUserId: number;
  let mainUserRootCategoryId: number;
  let mainUserTestCategoryId: number;

  let categoryData: { userId: number; title: string; description: string };
  let bookmarksData: { title: string; link: string; description: string; categoryId: number }[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, CategoryService, PrismaService],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    prismaService = module.get<PrismaService>(PrismaService);

    //////////////////////////
    // set up the test data
    const mainUser = await prismaService.user.create({
      data: {
        pwHash: '#hash#',
        email: 'test@example.com',
      },
    });

    mainUserId = mainUser.id;

    const rootCategory = await prismaService.category.create({
      data: {
        userId: mainUser.id,
        title: '__ROOT__',
      },
    });

    mainUserRootCategoryId = rootCategory.id;

    // set root category
    await prismaService.user.update({
      where: {
        id: mainUser.id,
      },
      data: {
        rootCategoryId: rootCategory.id,
      },
    });

    categoryData = { userId: mainUser.id, title: 'Test Category', description: 'A test category' };

    const mainCategory = await prismaService.category.create({
      data: categoryData,
    });

    mainUserTestCategoryId = mainCategory.id;

    bookmarksData = [
      {
        title: 'Bookmark 1',
        link: 'https://bookmark1.de',
        description: 'A bookmark',
        categoryId: mainUserTestCategoryId,
      },
      {
        title: 'Bookmark 2',
        link: 'https://bookmark2.de',
        description: 'Another bookmark',
        categoryId: mainUserTestCategoryId,
      },
    ];

    // create sample bookmarks
    await prismaService.bookmark.createMany({
      data: bookmarksData,
    });
  });

  afterAll(async () => {
    await prismaService.cleanDatabase();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const categoryDto: CreateCategoryDto = {
        title: 'New Category',
        description: 'A new category',
      };

      const { id: newCategoryId } = await categoryService.create(mainUserId, categoryDto);

      const newCategory = await prismaService.category.findUnique({
        where: { id: newCategoryId },
        include: { bookmarks: true },
      });

      expect(newCategory).toBeDefined();
      expect(newCategory.id).toBe(newCategoryId);
      expect(newCategory.title).toBe(categoryDto.title);
      expect(newCategory.description).toBe(categoryDto.description);
      expect(newCategory.bookmarks).toBeInstanceOf(Array);
    });

    it('should throw ForbiddenException if the category title is "__ROOT__"', async () => {
      const categoryDto: CreateCategoryDto = {
        title: '__ROOT__',
        description: 'A new category',
      };

      await expect(categoryService.create(mainUserId, categoryDto)).rejects.toThrowError(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categories = await categoryService.findAll(mainUserId);

      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBe(3);

      expect(categories[0].userId).toBe(mainUserId);
      expect(categories[1].userId).toBe(mainUserId);
      expect(categories[2].userId).toBe(mainUserId);

      expect(categories[0].bookmarks).toBeInstanceOf(Array);
      expect(categories[1].bookmarks).toBeInstanceOf(Array);
      expect(categories[2].bookmarks).toBeInstanceOf(Array);
    });
  });

  describe('findOne', () => {
    it('should return the category with the specified ID', async () => {
      const category = await categoryService.findOne(mainUserId, mainUserTestCategoryId);

      expect(category).toBeDefined();
      expect(category.id).toBe(mainUserTestCategoryId);
    });
  });

  describe('update', () => {
    it('should edit the category with the specified ID', async () => {
      const editCategoryDto: UpdateCategoryDto = {
        title: 'Updated Category',
      };

      await categoryService.update(mainUserId, mainUserTestCategoryId, editCategoryDto);

      const editedCategory = await prismaService.category.findUnique({
        where: { id: mainUserTestCategoryId },
        include: { bookmarks: true },
      });

      expect(editedCategory).toBeDefined();
      expect(editedCategory!.id).toBe(mainUserTestCategoryId);
      expect(editedCategory!.title).toBe(editCategoryDto.title);
      expect(editedCategory!.bookmarks).toBeInstanceOf(Array);
    });

    it('should throw ForbiddenException if category does not belong to the user', async () => {
      const secondUser = await prismaService.user.create({
        data: {
          email: 'new@user.de',
          pwHash: '#hash#',
        },
      });

      const categoryFromTheSecondUser = await prismaService.category.create({
        data: {
          userId: secondUser.id,
          title: 'A Category of the second user',
        },
      });

      const editCategoryDto: UpdateCategoryDto = {
        title: 'Updated Category',
      };

      await expect(
        categoryService.update(mainUserId, categoryFromTheSecondUser.id, editCategoryDto),
      ).rejects.toThrowError(ForbiddenException);

      const hopefullyNotEditedCategory = await prismaService.category.findUnique({
        where: { id: categoryFromTheSecondUser.id },
      });

      expect(hopefullyNotEditedCategory!.id).toBe(categoryFromTheSecondUser.id);
      expect(hopefullyNotEditedCategory!.title).toBe(categoryFromTheSecondUser.title);
    });
  });

  describe('remove', () => {
    it('should delete the category with the specified ID and move the corresponding bookmarks to the root-category', async () => {
      await categoryService.remove(mainUserId, mainUserTestCategoryId);

      const deletedCategory = await prismaService.category.findUnique({
        where: {
          id: mainUserTestCategoryId,
        },
      });

      expect(deletedCategory).toBeNull();

      const movedBookmarks = await prismaService.bookmark.findMany({
        where: {
          categoryId: mainUserRootCategoryId,
        },
      });

      expect(movedBookmarks.length).toBe(bookmarksData.length);
    });

    it('should throw ForbiddenException if user does not own the category', async () => {
      const secondUser = await prismaService.user.create({
        data: {
          email: 'new2@user.de',
          pwHash: '#hash#',
        },
      });

      const categoryFromTheSecondUser = await prismaService.category.create({
        data: {
          userId: secondUser.id,
          title: 'A Category of the second user',
        },
      });

      const currentCategoryCount = await prismaService.category.count();

      await expect(categoryService.remove(mainUserId, categoryFromTheSecondUser.id)).rejects.toThrow(
        ForbiddenException,
      );

      const newCategoryCount = await prismaService.category.count();

      expect(newCategoryCount).toBe(currentCategoryCount);
    });
  });
});
