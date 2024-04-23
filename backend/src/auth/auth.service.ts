import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable, Res } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './types/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * Registers a new user.
   *
   * @param dto - The authentication data for the user.
   * @returns The registered user.
   * @throws {ForbiddenException} If the user already exists.
   */
  async register(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          pwHash: hash,
        },
      });

      // create the root-category for the user
      const userRootCategory = await this.prismaService.category.create({
        data: {
          userId: user.id,
          title: '__ROOT__',
        },
      });

      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          rootCategoryId: userRootCategory.id,
        },
      });

      delete user.pwHash;

      const token = await this.signToken(user.id, user.email);

      return {
        access_token: token,
        root_category_id: userRootCategory.id,
        // This is useful because the the client then can save the root category id and does not have to fetch it from the server every time.
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('EMAIL_ALREADY_EXISTS');
        }
      }
      throw error;
    }
  }

  /**
   * Authenticates a user by verifying their credentials and generating a token.
   * @param dto - The authentication data including email and password.
   * @returns A token representing the authenticated user.
   * @throws ForbiddenException if the provided credentials are invalid.
   */
  async login(dto: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('INVALID_CREDENTIALS');
    }

    const pwMatches = await argon.verify(user.pwHash, dto.password);

    if (!pwMatches) {
      throw new ForbiddenException('INVALID_CREDENTIALS');
    }

    const token = await this.signToken(user.id, user.email);

    const userRootCategory = await this.prismaService.category.findUnique({
      where: {
        id: user.rootCategoryId,
      },
    });

    return {
      access_token: token,
      root_category_id: userRootCategory.id,
    };
  }

  /**
   * Generates a JWT token with the provided user ID and email.
   * @param userId - The ID of the user.
   * @param email - The email of the user.
   * @returns A promise that resolves to an object containing the generated access token.
   */
  private async signToken(userId: number, email: string): Promise<string> {
    const payload: JwtPayload = { userId, email };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret,
    });

    return token;
  }
}
