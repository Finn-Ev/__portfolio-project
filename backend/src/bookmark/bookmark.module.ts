import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { CategoryService } from '../category/category.service';
import { FavouriteModule } from './module-favourite/favourite.module';
import { FavouriteController } from './module-favourite/favourite.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [BookmarkService, CategoryService, PrismaService, FavouriteModule],
  controllers: [BookmarkController, FavouriteController],
  imports: [FavouriteModule],
  exports: [BookmarkService, FavouriteModule],
})
export class BookmarkModule {}
