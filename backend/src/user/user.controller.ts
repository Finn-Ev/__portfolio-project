import { Body, Controller, Delete, Get, HttpCode, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    delete user.pwHash;
    return user;
  }

  @Patch('me')
  updateMe(@GetUser('id') userId: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(userId, dto);
  }

  @Delete('me')
  @HttpCode(204)
  deleteMe(@GetUser('id') userId: number) {
    return this.userService.delete(userId);
  }
}
