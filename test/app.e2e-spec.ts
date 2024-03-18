import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { GlobalExceptionFilter } from '../src/exceptions/global-exception-filter';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { SignInDto, SignUpDto } from '../src/auth/dto';
import { UrlShortenerDto } from '../src/url-shortener/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true
    }));
    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  })

  afterAll(() => {
    app.close()
  });

  describe('Auth', () => {
    describe('Signup', () => {
      const dto: SignUpDto = {
        firstName: "Test",
        lastName: "User",
        email: "test.user@demo.com",
        password: "Test@123"
      };
      it('should throw if email empty', async () => {
        return await pactum.spec()
          .post('/auth/signup')
          .withJson({
            password: dto.password
          })
          .expectStatus(400)
      })

      it('should throw if password empty', async () => {
        return await pactum.spec()
          .post('/auth/signup')
          .withJson({
            email: dto.email
          })
          .expectStatus(400)
      })

      it('should throw if no dto', async () => {
        return await pactum.spec()
          .post('/auth/signup')
          .expectStatus(400)
      })

      it('should signup', async () => {
        return await pactum.spec()
          .post('/auth/signup')
          .withJson(dto)
          .expectStatus(201)
      });
    });

    describe('Signin', () => {
      const dto: SignInDto = {
        email: "test.user@demo.com",
        password: "Test@123"
      };
      it('should throw if email empty', async () => {
        return await pactum.spec()
          .post('/auth/signin')
          .withJson({
            password: dto.password
          })
          .expectStatus(400)
      })

      it('should throw if password empty', async () => {
        return await pactum.spec()
          .post('/auth/signin')
          .withJson({
            email: dto.email
          })
          .expectStatus(400)
      })

      it('should throw if no dto', async () => {
        return await pactum.spec()
          .post('/auth/signin')
          .expectStatus(400)
      })
      it('should signin', async () => {
        return await pactum.spec()
          .post('/auth/signin')
          .withJson(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token')
      })
    });
  });

  describe('Short Url', () => {

    describe('Get short url', () => {
      const dto: UrlShortenerDto = {
        url: "https://www.google.com/"
      }
      it('should throw when url is empty', async () => {
        return await pactum
        .spec()
        .post('/short-url')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(400)
      })

      it('should throw without access token', async () => {
        return await pactum
        .spec()
        .post('/short-url')
        .withJson(dto)
        .expectStatus(401)
        
      })
      it('should get the short url', async () => {
        return await pactum
        .spec()
        .post('/short-url')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .withJson(dto)
        .expectStatus(201)
        .stores('shortId', 'shortId')
      })
    })

    describe('Get short url Analytics', () => {
      it('should throw without access token', () => {
        return pactum
        .spec()
        .get('/analytics/$S{shortId}')
        .expectStatus(401)
      });

      it('should get the anylytics', () => {
        return pactum
        .spec()
        .get('/analytics/$S{shortId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200)
      })
    })
  })
})
