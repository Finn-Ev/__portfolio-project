import { Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { FavouriteService } from './favourite.service';
import { GetUser } from '../../auth/decorator/get-user.decorator';

@UseGuards(JwtGuard)
@Controller('favourites')
export class FavouriteController {
  constructor(private favouriteService: FavouriteService) {}

  @Get()
  async findAll(@GetUser('id') userId: number) {
    return this.favouriteService.getFavourites(userId);
  }

  @Patch(':bookmark_id/:new_value')
  async set(
    @GetUser('id') userId: number,
    @Param('bookmark_id', ParseIntPipe) bookmarkId: number,
    @Param('new_value', ParseBoolPipe) newValue: boolean,
  ) {
    return this.favouriteService.setFavourite(userId, bookmarkId, newValue);
  }
}
