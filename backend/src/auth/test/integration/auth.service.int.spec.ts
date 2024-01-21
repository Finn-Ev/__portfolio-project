import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from '../../dto/auth.dto';
import { jwtDecode } from 'jwt-decode';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, AuthService, PrismaService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prismaService.cleanDatabase();
  });

  describe('register', () => {
    it('should create a user with the specified values and return a JWT containing the user email and the userId', async () => {
      const dto: AuthDto = {
        email: 'test@test.de',
        password: 'test1234',
      };

      const token = await authService.register(dto);

      expect(token).toBeInstanceOf(Object);
      expect(token).toHaveProperty('access_token');

      const userData: any = jwtDecode(token.access_token);

      expect(userData).toHaveProperty('userId');
      expect(userData).toHaveProperty('email');

      expect(typeof userData.userId).toBe('number');
      expect(userData.email).toBe(dto.email);

      const registeredUser = await prismaService.user.findUnique({
        where: {
          id: userData.userId,
        },
      });

      expect(registeredUser).toBeInstanceOf(Object);
      expect(registeredUser.email).toBe(dto.email);
    });

    // it('should throw a ForbiddenException if email is already taken', async () => {
    //      this behavior is already covered by an e2e test
    // });

    // it('should throw an exception if the email is not a valid email', async () => {
    //      this behavior gets tested in an e2e test because the validation is done by the DTO at the controller level
    //      as an alternative we could test is in a controller unit test
    // });

    // it('should throw an exception if the password is invalid', async () => {
    //      this behavior gets tested in an e2e test because the validation is done by the DTO at the controller level
    //      as an alternative we could test is in a controller unit test
    // });

    describe('login', () => {
      it('should return a JWT containing the user-email and ID if the credentials are valid', async () => {
        const dto: AuthDto = {
          email: 'test@test.de',
          password: 'test1234',
        };

        await authService.register({
          email: dto.email,
          password: dto.password,
        });

        const token = await authService.login(dto);

        expect(token).toBeInstanceOf(Object);
        expect(token).toHaveProperty('access_token');

        const userData: any = jwtDecode(token.access_token);

        expect(userData).toHaveProperty('userId');
        expect(userData).toHaveProperty('email');

        expect(typeof userData.userId).toBe('number');

        const registeredUser = await prismaService.user.findUnique({
          where: {
            id: userData.userId,
          },
        });

        expect(registeredUser).toBeInstanceOf(Object);
        expect(registeredUser.email).toBe(dto.email);
      });

      //   it('should throw an exception if the user does not exist', async () => {
      //        this behavior is already covered by an e2e test
      //   });

      //   it('should throw a ForbiddenException if the credentials are invalid', async () => {
      //        this behavior is already covered by an e2e test
      //   });
    });
  });
});
