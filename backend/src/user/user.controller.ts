import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
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
    // return mock user
    // return {
    //   id: 1,
    //   firstName: 'Finn',
    //   lastName: 'Mertens',
    // };

    return user;
  }

  @Patch('me')
  updateMe(@GetUser('id') userId: number, @Body() dto: UpdateUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
