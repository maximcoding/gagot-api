import {HttpAdapterHost, NestFactory} from '@nestjs/core';
import {AppModule} from './modules/app/app.module';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {BadRequestException, HttpStatus, ValidationPipe} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as session from 'express-session';
import {join} from 'path';

const RedisStore = require('connect-redis')(session);

import * as cookieParser from 'cookie-parser';
import {config} from 'aws-sdk';
import * as csurf from 'csurf';
import * as helmet from 'helmet';
import * as passport from 'passport';

const compression = require('compression');
const flash = require('connect-flash');

import fs = require('fs');
import {MongoExceptionFilter} from './filters/mongo-exception.filter';
import {AllExceptionsFilter} from './filters/all-exceptions.filter';
import {LoggingInterceptor} from './interceptors/logging.interceptor';
import {TransformDataInterceptor} from './interceptors/transform-data.interceptor';
import {ExcludeNullInterceptor} from './interceptors/exclude-null.interceptor';
import {TimeoutInterceptor} from './interceptors/timeout.interceptor';
import {NestExpressApplication} from '@nestjs/platform-express';

const httpsOptions = {
  key: fs.readFileSync(__dirname + '/../ssl/keys/localhost.pem', 'utf8'),
  cert: fs.readFileSync(__dirname + '/../ssl/keys/localhost.cert', 'utf8'),
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bodyParser: true,
    httpsOptions: null,
  });

  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    // new ErrorsInterceptor(), // not working
    new ExcludeNullInterceptor(),
    new TimeoutInterceptor(),
    new TransformDataInterceptor(),
  );
  const {httpAdapter} = app.get(HttpAdapterHost);

  app.useGlobalFilters(new MongoExceptionFilter(), new AllExceptionsFilter(httpAdapter));
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });
  app.use(helmet());
  // const whitelist = configService.get('ALLOWED_ORIGINS')?.split(/\s*,\s*/) ?? '*';
  const whitelist = ['https://gagot-app.herokuapp.com', 'http://localhost:4200', 'http://localhost:3000'];
  app.enableCors({
    origin: whitelist,
    credentials: true,
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Origin, Content-type, Accept, Authorization, x-xsrf-token',
    exposedHeaders: ['Authorization'],
  });
  // app.use(csurf({cookie: true}));
  const redisURL = `redis://:${process.env.REDIS_PASS}@localhost:${process.env.REDIS_PORT_OUT}`;
  const cookieMaxAge = 1000 * 60 * 60 * 24 * 7;
  const redisStore = new RedisStore({client: require('redis').createClient(redisURL), ttl: cookieMaxAge});
  app.use(cookieParser(configService.get('SECRET_COOKIE_SESSION')));
  app.use(
    session({
      secret: configService.get('SECRET_COOKIE_SESSION'),
      resave: false,
      saveUninitialized: false,
      rolling: true, // keep session alive
      store: redisStore,
      cookie: {
        maxAge: cookieMaxAge,
        httpOnly: true,
        sameSite: 'none', // 'strict'
        signed: true,
        secure: false,
      },
    }),
  );
  app.use(flash());
  app.use(passport.initialize());
  // middleware is to deserialize user object from session using passport.deserializeUser
  // function (that you define in your passport configuration).
  // When user first authenticates itself, its user object is serialized and stored in the session
  app.use(passport.session());
  app.use(compression());
  app.setGlobalPrefix('/api');
  swaggerSetup(app);
  const HOST = process.env.HOST || '0.0.0.0';
  const PORT = process.env.PORT || 8080;
  const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Explore api on http://localhost:${PORT}/api`);
  });
}

function swaggerSetup(app) {
  const config = new DocumentBuilder()
    .setTitle('GagotApp REST API Design')
    .setDescription('Explore and test GagotApp API endpoints')
    .setVersion('1.0')
    // .addBasicAuth()
    // .addCookieAuth('optional-session-id')
    .addBearerAuth()
    .addTag('Endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

bootstrap();
