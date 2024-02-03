import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../types/jwt.payload';
import { Request as RequestType } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // first we try to extract the token from the cookies
        // this is handy for web-clients
        JwtStrategy.extractFromCookies,
        // if it's not there we try to extract it from the header
        // this is handy for non-web clients like mobile apps
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  private static extractFromCookies(req: RequestType): string | null {
    if (req.cookies && req.cookies.user_token && req.cookies.user_token.access_token) {
      return req.cookies.user_token.access_token;
    }
    return null;
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });
    delete user.pwHash;
    return user; // this will be added to the request object when the value is truthy
  }
}
