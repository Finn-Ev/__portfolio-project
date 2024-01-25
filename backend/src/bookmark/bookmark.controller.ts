import {
  UseGuards,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Patch,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  create(@Body() dto: CreateBookmarkDto) {
    // the dto has the categoryId as a property which then links the bookmark to the user
    return this.bookmarkService.create(dto);
  }

  @Get(':id')
  findOne(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
    return this.bookmarkService.findOne(userId, bookmarkId);
  }

  @Get('')
  findAll(@GetUser('id') userId: number) {
    return this.bookmarkService.findAll(userId);
  }

  @Get('/category/:id')
  findAllForCategory(@GetUser('id') userId: number, @Param('id', ParseIntPipe) categoryId: number) {
    return this.bookmarkService.findAllForCategory(userId, categoryId);
  }

  @Patch(':id')
  update(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.update(userId, bookmarkId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
    return this.bookmarkService.remove(userId, bookmarkId);
  }
}
