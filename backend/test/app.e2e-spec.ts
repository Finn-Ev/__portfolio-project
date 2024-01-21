import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmark/dto';
import * as supertest from 'supertest';
import { EditUserDto } from '../src/user/dto/edit-user.dto';

const PORT = 4002;

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let bookmarkId: string;
  let userAccessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    await app.listen(PORT);

    prisma = app.get(PrismaService);

    await prisma.cleanDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  const userAuthDto: AuthDto = { email: 'test@e2e.com', password: 'test1234' };

  describe('Auth', () => {
    describe('Register', () => {
      it('should throw an exception when no body was provided', () => {
        return supertest(app.getHttpServer())
          .post('/auth/register')
          .expect(400);
      });

      it('should throw an exception when the email is invalid', () => {
        return supertest(app.getHttpServer())
          .post('/auth/register')
          .send({ ...userAuthDto, email: 'test_test.de' })
          .expect(400);
      });

      it('should throw an exception when the password contains less than eight letters', () => {
        return supertest(app.getHttpServer())
          .post('/auth/register')
          .send({ ...userAuthDto, password: '1234567' })
          .expect(400);
      });

      it('should register a user when the inputs are valid', () => {
        return supertest(app.getHttpServer())
          .post('/auth/register')
          .send(userAuthDto)
          .expect(201);
      });
    });

    describe('Login', () => {
      it('should throw an exception when no body was provided', () => {
        return supertest(app.getHttpServer()).post('/auth/login').expect(400);
      });

      it('should throw an 403 (forbidden) status when the user does not exist', () => {
        return supertest(app.getHttpServer())
          .post('/auth/login')
          .send({ ...userAuthDto, email: 'test@test.de' })
          .expect(403);
      });

      it('should return a 403 (forbidden) status when the password is wrong', () => {
        return supertest(app.getHttpServer())
          .post('/auth/login')
          .send({ ...userAuthDto, password: 'WRONG123' })
          .expect(403);
      });

      it('should login a user when credentials are valid', () => {
        return supertest(app.getHttpServer())
          .post('/auth/login')
          .send(userAuthDto)
          .expect(200)
          .then((response) => {
            userAccessToken = response.body.access_token;
          });
      });
    });
  });

  describe('User', () => {
    describe('Get current user', () => {
      it('should return a 401 status when no access-token was provided', () => {
        return supertest(app.getHttpServer()).get('/users/me').expect(401);
      });

      it('should return a 401 status when the access-token is invalid', () => {
        return supertest(app.getHttpServer())
          .get('/users/me')
          .set('Authorization', 'Bearer __invalid__')
          .expect(401);
      });

      it('should return the user when the user is logged in', () => {
        return supertest(app.getHttpServer())
          .get('/users/me')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(200)
          .expect((response: any) => {
            const userInfo = JSON.parse(response.text);
            expect(userInfo.email).toBe(userAuthDto.email);
          });
      });
    });

    describe('Edit current user', () => {
      const validEmail = 'test@test.de';
      const invalidEmail = 'test@test.';

      it('should edit user when the new value is valid', () => {
        const editUserDto: EditUserDto = { email: validEmail };

        return supertest(app.getHttpServer())
          .patch('/users/me')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(editUserDto)
          .expect(200)
          .expect((response) => {
            expect(response.body.email).toBe(editUserDto.email);
          });
      });

      it('should return a 400 status when the new value is invalid', () => {
        const editUserDto: EditUserDto = { email: invalidEmail };

        return supertest(app.getHttpServer())
          .patch('/users/me')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(editUserDto)
          .expect(400);
      });
    });

    describe('Delete User', () => {});
  });

  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => {
      it('should get bookmarks', () => {
        return supertest(app.getHttpServer())
          .get('/bookmarks')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(200)
          .expect((response) => {
            expect(response.body).toEqual([]);
          });
      });
    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'First Bookmark',
        link: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
      };
      it('should create bookmark', () => {
        return supertest(app.getHttpServer())
          .post('/bookmarks')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(dto)
          .expect(201)
          .expect((response) => {
            bookmarkId = response.body.id;
          });
      });
    });

    describe('Get bookmarks', () => {
      it('should get bookmarks', () => {
        return supertest(app.getHttpServer())
          .get('/bookmarks')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(200)
          .expect((response) => {
            expect(response.body.length).toBe(1);
          });
      });
    });

    describe('Get bookmark by id', () => {
      it('should get bookmark by id', () => {
        return supertest(app.getHttpServer())
          .get(`/bookmarks/${bookmarkId}`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(200)
          .expect((response) => {
            expect(response.body.id).toBe(bookmarkId);
          });
      });
    });

    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title:
          'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
        description:
          'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
      };
      it('should edit bookmark', () => {
        return supertest(app.getHttpServer())
          .patch(`/bookmarks/${bookmarkId}`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(dto)
          .expect(200)
          .expect((response) => {
            expect(response.body.title).toBe(dto.title);
            expect(response.body.description).toBe(dto.description);
          });
      });
    });

    describe('Delete bookmark by id', () => {
      it('should delete bookmark', () => {
        return supertest(app.getHttpServer())
          .delete(`/bookmarks/${bookmarkId}`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(204);
      });

      it('should get empty bookmarks', () => {
        return supertest(app.getHttpServer())
          .get('/bookmarks')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(200)
          .expect((response) => {
            expect(response.body.length).toBe(0);
          });
      });
    });
  });
});
