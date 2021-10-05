import {Module} from '@nestjs/common';
import {TwilioModule} from 'nestjs-twilio';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {SmsService} from './sms.service';

@Module({
  imports: [
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cfg: ConfigService) => ({
        accountSid: cfg.get('TWILIO_ACCOUNT_SID'),
        authToken: cfg.get('TWILIO_AUTH_TOKEN'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
