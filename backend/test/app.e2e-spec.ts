import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { CreateBookmarkDto, UpdateBookmarkDto } from '../src/bookmark/dto';
import * as supertest from 'supertest';
import { UpdateUserDto } from '../src/user/dto/update-user.dto';

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

  const validUserAuthDto: AuthDto = {
    email: 'test@e2e.com',
    password: 'test1234',
  };
  const invalidEmail = 'test@e2e.';
  const invalidPassword = '1234567'; // too short (min. 8 letters)

  describe('Auth', () => {
    describe('Register', () => {
      it('should throw an exception when no body was provided', () => {
        return supertest(app.getHttpServer())
          .post('/auth/register')
          .expect(400);
      });

      it('should throw an exception when the email is not a valid email', () => {
        return supertest(app.getHttpServer())
          .post('/auth/register')
          .send({ ...validUserAuthDto, email: invalidEmail })
          .expect(400);
      });

      it('should throw an exception when the password is too short', () => {
        return supertest(app.getHttpServer())
          .post('/auth/register')
          .send({ ...validUserAuthDto, password: invalidPassword })
          .expect(400);
      });

      it('should register a user when the inputs are valid', () => {
        return supertest(app.getHttpServer())
          .post('/auth/register')
          .send(validUserAuthDto)
          .expect(201)
          .expect((response) => {
            expect(response.body).toHaveProperty('access_token');
          });
      });

      it('should return a 403 (forbidden) status when the email is already taken', () => {
        return supertest(app.getHttpServer())
          .post('/auth/register')
          .send(validUserAuthDto)
          .expect(403);
      });
    });

    describe('Login', () => {
      it('should throw an exception when no body was provided', () => {
        return supertest(app.getHttpServer()).post('/auth/login').expect(400);
      });

      it('should return a 400 status when the email is not a valid email', () => {
        return supertest(app.getHttpServer())
          .post('/auth/login')
          .send({ ...validUserAuthDto, email: invalidEmail })
          .expect(400);
      });

      it('should return a 400 status when the password is too short', () => {
        return supertest(app.getHttpServer())
          .post('/auth/login')
          .send({ ...validUserAuthDto, password: invalidPassword })
          .expect(400);
      });

      it('should throw a 403 (forbidden) status when the user with that email does not exist', () => {
        return supertest(app.getHttpServer())
          .post('/auth/login')
          .send({ ...validUserAuthDto, email: 'unknown@user.de' })
          .expect(403);
      });

      it('should return a 403 (forbidden) status when the password is wrong', () => {
        return supertest(app.getHttpServer())
          .post('/auth/login')
          .send({ ...validUserAuthDto, password: 'WRONG_PASSWORD' })
          .expect(403);
      });

      it('should login a user when credentials are valid', () => {
        return supertest(app.getHttpServer())
          .post('/auth/login')
          .send(validUserAuthDto)
          .expect(200)
          .expect((response) => {
            expect(response.body).toHaveProperty('access_token');
          })
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
            expect(userInfo.email).toBe(validUserAuthDto.email);
          });
      });
    });

    describe('Edit current user', () => {
      const newValidEmail = 'test@test.de';

      it('should edit user when the new value is valid', () => {
        const editUserDto: UpdateUserDto = { email: newValidEmail };

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
        const editUserDto: UpdateUserDto = { email: invalidEmail };

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
          .then((response) => {
            bookmarkId = response.body.id;
          });
      });
    });

    describe('Get bookmarks', () => {
      it('should get all available bookmarks', () => {
        return supertest(app.getHttpServer())
          .get('/bookmarks')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(200)
          .expect((response) => {
            expect(response.body.length).toBe(1);
          });
      });
    });

    describe('Get bookmark', () => {
      it('should get the bookmark by id', () => {
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
      const dto: UpdateBookmarkDto = {
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

  afterAll(async () => {
    await app.close();
  });
});
