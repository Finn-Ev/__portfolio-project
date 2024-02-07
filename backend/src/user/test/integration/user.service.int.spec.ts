import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../../prisma/prisma.service';

import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserService } from '../../user.service';

describe('CategoryService', () => {
  let prismaService: PrismaService;
  let userService: UserService;

  let mainUserId: number;
  let mainCategoryId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, UserService, PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
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

  describe('update', () => {
    it('should edit the current user', async () => {
      const editUserDto: UpdateUserDto = {
        email: 'test@test2.de',
      };

      await userService.update(mainUserId, editUserDto);

      const editedUser = await prismaService.user.findUnique({
        where: { id: mainUserId },
      });

      expect(editedUser).toBeDefined();
      expect(editedUser!.id).toBe(mainUserId);
      expect(editedUser!.email).toBe(editedUser.email);
    });
  });

  describe('remove', () => {
    // we basically test the cascading delete works correctly
    it('should delete the user current user and all their data', async () => {
      await userService.delete(mainUserId);

      const deletedUser = await prismaService.user.findUnique({
        where: { id: mainUserId },
      });

      expect(deletedUser).toBeNull();

      const deletedCategories = await prismaService.category.findMany({
        where: {
          id: mainCategoryId,
        },
      });

      expect(deletedCategories.length).toBe(0);

      const deletedBookmarks = await prismaService.bookmark.findMany({
        where: {
          categoryId: mainCategoryId,
        },
      });

      expect(deletedBookmarks.length).toBe(0);
    });
  });
});
