import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable, Res } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './types/jwt.payload';
import { Response } from 'express';

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
  async register(dto: AuthDto, res) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          pwHash: hash,
        },
      });

      delete user.pwHash;

      const token = await this.signToken(user.id, user.email);

      res.cookie('user_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // sameSite: 'strict',
      });

      return token;
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
  async login(dto: AuthDto, res: Response) {
    const user = await this.prismaService.user.findUnique({
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

    const token = await this.signToken(user.id, user.email);

    res.cookie('user_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // sameSite: 'strict',
    });

    return token;
  }

  async logout(res: Response) {
    res.clearCookie('user_token');
    return {
      message: 'Cookie has been cleared',
    };
  }

  /**
   * Generates a JWT token with the provided user ID and email.
   * @param userId - The ID of the user.
   * @param email - The email of the user.
   * @returns A promise that resolves to an object containing the generated access token.
   */
  async signToken(userId: number, email: string): Promise<{ access_token: string }> {
    const payload: JwtPayload = { userId, email };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      //   expiresIn: '1d',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
