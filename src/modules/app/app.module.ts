import {CacheModule, MiddlewareConsumer, Module} from '@nestjs/common';
import {ThrottlerModule} from '@nestjs/throttler';
import {ConfigModule} from '@nestjs/config';
import {validate} from '../../env.validation';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PropertiesModule} from '../properties/properties.module';
import {CategoriesModule} from '../categories/categories.module';
import {AuthModule} from '../auth/auth.module';
import {UserModule} from '../users/user.module';
import {SmsModule} from '../sms/sms.module';
import {EmailModule} from '../email/email.module';
import {FilesModule} from '../files/files.module';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {LoggingInterceptor} from '../../interceptors/logging.interceptor';

let envFilePath = '.development.env';
console.log(`Running in ${process.env.NODE_ENV}`);
if (process.env.ENVIRONMENT === 'PRODUCTION') {
  envFilePath = '.production.env';
} else if (process.env.ENVIRONMENT === 'TEST') {
  envFilePath = '.testing.env';
}

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  imports: [
    AuthModule,
    UserModule,
    PropertiesModule,
    CategoriesModule,
    FilesModule,
    ThrottlerModule.forRoot({
      ttl: +process.env.TROTTLER_TTL,
      limit: +process.env.TROTTLER_LIMIT,
    }),
    ConfigModule.forRoot({
      envFilePath,
      expandVariables: true,
      isGlobal: true,
      cache: true,
      validate,
    }),
    SmsModule,
    EmailModule,
  ],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {}
}
