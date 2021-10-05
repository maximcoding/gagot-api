import {Module} from '@nestjs/common';
import {SendGridModule} from '@ntegral/nestjs-sendgrid';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {EmailService} from './email.service';

@Module({
  imports: [
    SendGridModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cfg: ConfigService) => ({
        apiKey: cfg.get('SENDGRID_API_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
