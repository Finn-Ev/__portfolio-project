import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { CreateBookmarkDto, UpdateBookmarkDto } from '../src/bookmark/dto';
import * as supertest from 'supertest';
import { UpdateUserDto } from '../src/user/dto/update-user.dto';
import { CreateCategoryDto, UpdateCategoryDto } from '../src/category/dto';

const PORT = 4002;

const authRegisterEndpoint = '/auth/register';
const authLoginEndpoint = '/auth/login';
const usersMeEndpoint = '/users/me';
const categoryEndpointPath = '/categories';
const bookmarksEndpoint = '/bookmarks';
const favouritesEndpoint = '/favourites';

const validUserAuthDto: AuthDto = {
  email: 'test@e2e.com',
  password: 'test1234',
};

const invalidEmail = 'test@e2e.';
const invalidPassword = '1234567'; //  too short (min. 8 letters)

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let userAccessToken: string;
  let categoryId: number;
  let bookmarkId: number;

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

  describe('CREATE, GET AND UPDATE', () => {
    describe('AUTH', () => {
      describe('POST /register', () => {
        it('should throw an exception when the email is not a valid email', () => {
          return supertest(app.getHttpServer())
            .post(authRegisterEndpoint)
            .send({ ...validUserAuthDto, email: invalidEmail })
            .expect(400);
        });

        it('should throw an exception when the password is too short', () => {
          return supertest(app.getHttpServer())
            .post(authRegisterEndpoint)
            .send({ ...validUserAuthDto, password: invalidPassword })
            .expect(400);
        });

        it('should register a user when the inputs are valid', () => {
          return supertest(app.getHttpServer())
            .post(authRegisterEndpoint)
            .send(validUserAuthDto)
            .expect(201)
            .expect((response) => {
              expect(response.body).toHaveProperty('access_token');
            });
        });

        it('should return a 403 status when the email is already taken', () => {
          return supertest(app.getHttpServer()).post(authRegisterEndpoint).send(validUserAuthDto).expect(403);
        });
      });

      describe('POST /login', () => {
        it('should throw an exception when no body was provided', () => {
          return supertest(app.getHttpServer()).post(authLoginEndpoint).expect(400);
        });

        it('should return a 400 status when the email is not a valid email', () => {
          return supertest(app.getHttpServer())
            .post(authLoginEndpoint)
            .send({ ...validUserAuthDto, email: invalidEmail })
            .expect(400);
        });

        it('should return a 400 status when the password is too short', () => {
          return supertest(app.getHttpServer())
            .post(authLoginEndpoint)
            .send({ ...validUserAuthDto, password: invalidPassword })
            .expect(400);
        });

        it('should throw a 403 status when the user with that email does not exist', () => {
          return supertest(app.getHttpServer())
            .post(authLoginEndpoint)
            .send({ ...validUserAuthDto, email: 'unknown@user.de' })
            .expect(403);
        });

        it('should return a 403 status when the password is wrong', () => {
          return supertest(app.getHttpServer())
            .post(authLoginEndpoint)
            .send({ ...validUserAuthDto, password: 'WRONG_PASSWORD' })
            .expect(403);
        });

        it('should login a user when credentials are valid', () => {
          return supertest(app.getHttpServer())
            .post(authLoginEndpoint)
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

    describe('USER', () => {
      describe('GET users/me', () => {
        it('should return a 401 status when no access-token was provided', () => {
          return supertest(app.getHttpServer()).get(usersMeEndpoint).expect(401);
        });

        it('should return a 401 status when the access-token is invalid', () => {
          return supertest(app.getHttpServer())
            .get(usersMeEndpoint)
            .set('Authorization', 'Bearer __invalid__')
            .expect(401);
        });

        it('should return the user when the user is logged in', () => {
          return supertest(app.getHttpServer())
            .get(usersMeEndpoint)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .expect(200)
            .expect((response: any) => {
              const userInfo = JSON.parse(response.text);
              expect(userInfo.email).toBe(validUserAuthDto.email);
            });
        });
      });

      describe('PATCH /users/me', () => {
        const newValidEmail = 'test@test.de';

        it('should edit user when the new value is valid', () => {
          const editUserDto: UpdateUserDto = { email: newValidEmail };

          return supertest(app.getHttpServer())
            .patch(usersMeEndpoint)
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
            .patch(usersMeEndpoint)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .send(editUserDto)
            .expect(400);
        });
      });

      describe('Delete User', () => {});
    });

    describe('CATEGORIES', () => {
      describe('GET /categories', () => {
        it('should get empty categories', () => {
          return supertest(app.getHttpServer())
            .get(categoryEndpointPath)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .expect(200)
            .expect((response) => {
              expect(response.body).toEqual([]);
            });
        });
      });

      describe('POST /categories', () => {
        const dto: CreateCategoryDto = {
          title: 'First category',
        };
        it('should create category', () => {
          return supertest(app.getHttpServer())
            .post(categoryEndpointPath)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .send(dto)
            .expect(201)
            .expect((response) => {
              expect(response.body.title).toBe(dto.title);
              expect(response.body).toHaveProperty('id');
            })
            .then((response) => {
              categoryId = response.body.id;
            });
        });
      });

      describe('GET /categories', () => {
        it('should get all available categories', () => {
          return supertest(app.getHttpServer())
            .get(categoryEndpointPath)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .expect(200)
            .expect((response) => {
              expect(response.body.length).toBe(1);
            });
        });
      });

      describe('GET categories/:id', () => {
        it('should get the category by id', () => {
          return supertest(app.getHttpServer())
            .get(`${categoryEndpointPath}/${categoryId}`)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .expect(200)
            .expect((response) => {
              expect(response.body.id).toBe(categoryId);
            });
        });

        it('should return a 403 status when the category was not found', () => {
          return supertest(app.getHttpServer())
            .get(`${categoryEndpointPath}/0`)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .expect(403);
        });
      });

      describe('PATCH categories/:id', () => {
        const dto: UpdateCategoryDto = {
          title: 'New title',
        };
        it('should edit category by ID', () => {
          return supertest(app.getHttpServer())
            .patch(`${categoryEndpointPath}/${categoryId}`)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .send(dto)
            .expect(200)
            .expect((response) => {
              expect(response.body.id).toBe(categoryId);
              expect(response.body.title).toBe(dto.title);
            });
        });
      });
    });

    describe('BOOKMARKS', () => {
      describe('GET /bookmarks/category/:categoryId', () => {
        it('should get no bookmarks from the category', () => {
          return supertest(app.getHttpServer())
            .get(`${bookmarksEndpoint}/category/${categoryId}`)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .expect(200)
            .expect((response) => {
              expect(response.body).toEqual([]);
            });
        });
      });

      describe('POST /bookmarks', () => {
        it('should create a bookmark', () => {
          const dto: CreateBookmarkDto = {
            categoryId: categoryId,
            title: 'First Bookmark',
            link: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
          };

          return supertest(app.getHttpServer())
            .post(bookmarksEndpoint)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .send({ ...dto })
            .expect(201)
            .then((response) => {
              bookmarkId = response.body.id;
            });
        });
      });

      describe('GET /bookmarks/category/:categoryId', () => {
        it('should get all bookmarks of the category', () => {
          return supertest(app.getHttpServer())
            .get(`${bookmarksEndpoint}/category/${categoryId}`)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .expect(200)
            .expect((response) => {
              expect(response.body.length).toBe(1);
            });
        });
      });

      describe('GET /bookmarks', () => {
        it('should get all available bookmarks by the current the user', () => {
          return supertest(app.getHttpServer())
            .get(`${bookmarksEndpoint}`)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .expect(200)
            .expect((response) => {
              expect(response.body.length).toBe(1);
            });
        });
      });

      describe('GET /bookmarks/:id', () => {
        it('should get the bookmark by id', () => {
          return supertest(app.getHttpServer())
            .get(`${bookmarksEndpoint}/${bookmarkId}`)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .expect(200)
            .expect((response) => {
              expect(response.body.id).toBe(bookmarkId);
            });
        });

        it('should return a 404 status when the bookmark does not exist', () => {
          return supertest(app.getHttpServer())
            .get(`${bookmarksEndpoint}/0`)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .expect(404);
        });
      });

      describe('PATCH /bookmarks/:id', () => {
        const dto: UpdateBookmarkDto = {
          title: 'New title',
          description: 'New description',
        };
        it('should edit bookmark by ID', () => {
          return supertest(app.getHttpServer())
            .patch(`${bookmarksEndpoint}/${bookmarkId}`)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .send(dto)
            .expect(200)
            .expect((response) => {
              expect(response.body.title).toBe(dto.title);
              expect(response.body.description).toBe(dto.description);
            });
        });
      });
    });

    describe('FAVOURITES', () => {
      describe('PATCH /favourites/set/:bookmarkId/true', () => {
        it('should set bookmark as favourite', () => {
          return supertest(app.getHttpServer())
            .patch(`${favouritesEndpoint}/set/${bookmarkId}/true`)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .expect(200)
            .expect((response) => {
              expect(response.body.id).toBe(bookmarkId);
              expect(response.body.isFavourite).toBe(true);
            });
        });
      });

      describe('GET /favourites', () => {
        it('should return available favourites', () => {
          return supertest(app.getHttpServer())
            .get(favouritesEndpoint)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .expect(200)
            .expect((response) => {
              expect(response.body.length).toBe(1);
            });
        });
      });

      describe('PATCH /favourites/set/:bookmarkId/false', () => {
        it('PATCH /favourites/set/:bookmarkId/:value', () => {
          return supertest(app.getHttpServer())
            .patch(`${favouritesEndpoint}/set/${bookmarkId}/false`)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .expect(200)
            .expect((response) => {
              expect(response.body.id).toBe(bookmarkId);
              expect(response.body.isFavourite).toBe(false);
            });
        });
      });

      describe('GET /favourites', () => {
        it('should return no favourites', () => {
          return supertest(app.getHttpServer())
            .get(favouritesEndpoint)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .expect(200)
            .expect((response) => {
              expect(response.body.length).toBe(0);
            });
        });
      });
    });
  });

  describe('DELETION', () => {
    describe('DELETE /bookmarks/:bookmarkId', () => {
      it('should delete bookmark', () => {
        return supertest(app.getHttpServer())
          .delete(`${bookmarksEndpoint}/${bookmarkId}`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(204);
      });
    });

    describe('DELETE /categories/:categoryId', () => {
      it('should delete category', () => {
        return supertest(app.getHttpServer())
          .delete(`${categoryEndpointPath}/${categoryId}`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(204);
      });
    });

    describe('DELETE /users/me', () => {
      it('should delete the current user', () => {
        return supertest(app.getHttpServer())
          .delete(usersMeEndpoint)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(204);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
