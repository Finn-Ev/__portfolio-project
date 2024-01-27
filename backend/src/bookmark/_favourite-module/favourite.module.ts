import { Module } from '@nestjs/common';
import { FavouriteController } from './favourite.controller';
import { FavouriteService } from './favourite.service';
import { BookmarkService } from '../bookmark.service';
import { CategoryService } from '../../category/category.service';

@Module({
  controllers: [FavouriteController],
  providers: [FavouriteService, BookmarkService, CategoryService],
  exports: [FavouriteService],
})
export class FavouriteModule {}
