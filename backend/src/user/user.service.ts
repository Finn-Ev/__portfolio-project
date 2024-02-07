import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async update(userId: number, dto: UpdateUserDto) {
    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.pwHash;

    return user;
  }

  async delete(userId: number) {
    // because of the cascading delete, the user's categories and bookmarks will be deleted as well
    return this.prismaService.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
