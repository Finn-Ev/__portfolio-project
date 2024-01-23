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
  let mainCategoryId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, CategoryService, PrismaService],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
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
    it('should create a new category', async () => {
      const categoryDto = {
        title: 'New Category',
      };

      const { id: newCategoryId } = await categoryService.create(mainUserId, categoryDto);

      const newCategory = await prismaService.category.findUnique({
        where: { id: newCategoryId },
      });

      expect(newCategory).toBeDefined();
      expect(newCategory.id).toBe(newCategoryId);
      expect(newCategory.title).toBe(categoryDto.title);
    });
  });

  describe('findAllFromUser', () => {
    it('should return an array of categories', async () => {
      await prismaService.category.deleteMany(); // delete the category created in beforeEach to avoid confusion

      const newCategoriesData = [
        {
          userId: mainUserId,
          title: 'Category 1',
          description: 'My first category',
        },
        {
          userId: mainUserId,
          title: 'Category 2',
          description: 'My second category',
        },
      ];

      await prismaService.category.createMany({
        data: newCategoriesData,
      });

      const categories = await categoryService.findAllFromUser(mainUserId);

      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBe(2);

      expect(categories[0].userId).toBe(mainUserId);
      expect(categories[1].userId).toBe(mainUserId);

      expect(categories[0].title).toBe(newCategoriesData[0].title);
      expect(categories[1].title).toBe(newCategoriesData[1].title);

      expect(categories[0].description).toBe(newCategoriesData[0].description);
      expect(categories[1].description).toBe(newCategoriesData[1].description);
    });
  });

  describe('findOneFromUser', () => {
    it('should return the category with the specified ID', async () => {
      const category = await categoryService.findOneFromUser(mainUserId, mainCategoryId);

      expect(category).toBeDefined();
      expect(category.id).toBe(mainCategoryId);
    });
  });

  describe('update', () => {
    it('should edit the category with the specified ID', async () => {
      const editCategoryDto: UpdateCategoryDto = {
        title: 'Updated Category',
      };

      await categoryService.update(mainUserId, mainCategoryId, editCategoryDto);

      const editedCategory = await prismaService.category.findUnique({
        where: { id: mainCategoryId },
      });

      expect(editedCategory).toBeDefined();
      expect(editedCategory!.id).toBe(mainCategoryId);
      expect(editedCategory!.title).toBe(editCategoryDto.title);
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
    it('should delete the categpry with the specified ID', async () => {
      await categoryService.remove(mainUserId, mainCategoryId);

      const deletedCategory = await prismaService.category.findUnique({
        where: {
          id: mainCategoryId,
        },
      });

      expect(deletedCategory).toBeNull();
    });

    it('should throw ForbiddenException if user does not own the category', async () => {
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

      const currentCategoryCount = await prismaService.category.count();

      await expect(categoryService.remove(mainUserId, categoryFromTheSecondUser.id)).rejects.toThrow(
        ForbiddenException,
      );

      const newCategoryCount = await prismaService.category.count();

      expect(newCategoryCount).toBe(currentCategoryCount);
    });
  });
});
