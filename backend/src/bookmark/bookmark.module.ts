import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { CategoryService } from '../category/category.service';

@Module({
  providers: [BookmarkService, CategoryService],
  controllers: [BookmarkController],
})
export class BookmarkModule {}
