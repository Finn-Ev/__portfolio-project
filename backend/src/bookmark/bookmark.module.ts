import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { CategoryService } from '../category/category.service';
import { FavouriteModule } from './_favourite-module/favourite.module';
import { FavouriteController } from './_favourite-module/favourite.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [BookmarkService, CategoryService, PrismaService, FavouriteModule],
  controllers: [BookmarkController, FavouriteController],
  imports: [FavouriteModule],
  exports: [BookmarkService, FavouriteModule],
})
export class BookmarkModule {}
