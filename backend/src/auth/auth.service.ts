import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './types/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
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
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          pwHash: hash,
        },
      });

      delete user.pwHash;

      return user;
      //   return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exists');
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
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const pwMatches = await argon.verify(user.pwHash, dto.password);

    if (!pwMatches) {
      throw new ForbiddenException('Invalid credentials');
    }

    return this.signToken(user.id, user.email);
  }

  /**
   * Generates a JWT token with the provided user ID and email.
   * @param userId - The ID of the user.
   * @param email - The email of the user.
   * @returns A promise that resolves to an object containing the generated access token.
   */
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload: JwtPayload = { userId, email };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
