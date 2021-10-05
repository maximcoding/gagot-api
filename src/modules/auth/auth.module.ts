import {forwardRef, Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtStrategy} from './strategies/jwt.strategy';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {DatabaseModule} from '../database';
import {UserModule} from '../users/user.module';
import {LocalStrategy} from './strategies/local.strategy';
import {AuthController} from './auth.controller';
import {SessionCookieSerializer} from './session-cookie-serializer.service';
import {authProviders} from './auth.providers';
import {SmsModule} from '../sms/sms.module';
import {EmailModule} from '../email/email.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    ConfigModule,
    SmsModule,
    EmailModule,
    DatabaseModule,
    PassportModule.register({session: true, defaultStrategy: 'jwt'}), // oidc
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        return {
          secret: process.env.SECRET_KEY || 'secretKey',
          signOptions: {
            expiresIn: process.env.JWT_SECRET_TOKEN_EXP,
            algorithm: 'HS384',
          },
          verifyOptions: {
            algorithms: ['HS384'],
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, SessionCookieSerializer, ...authProviders],
  exports: [AuthService],
})
export class AuthModule {}
