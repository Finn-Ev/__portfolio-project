import { PrismaService } from '../../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { BookmarkService } from '../bookmark.service';

@Injectable()
export class FavouriteService {
  constructor(
    private prismaService: PrismaService,
    private bookmarkService: BookmarkService,
  ) {}

  async getFavourites(userId: number) {
    const allBookmarks = await this.bookmarkService.findAll(userId);

    return allBookmarks.filter((bookmark) => bookmark.isFavourite);
  }

  async setFavourite(userId: number, bookmarkId: number, newValue: boolean) {
    if (
      !(await this.bookmarkService.checkIfUserOwnsBookmark(userId, bookmarkId))
    ) {
      throw new ForbiddenException();
    }

    await this.prismaService.bookmark.update({
      where: { id: bookmarkId },
      data: { isFavourite: newValue },
    });
  }
}
