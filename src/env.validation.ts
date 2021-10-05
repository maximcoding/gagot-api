import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;
  @IsNumber()
  APP_PORT: number;
  @IsString()
  APP_HOST: string;
  @IsString()
  MONGO_DB_URI: string;
  @IsString()
  TWILIO_ACCOUNT_SID: string;
  @IsString()
  TWILIO_AUTH_TOKEN: string;
  @IsString()
  TWILIO_PHONE_NUMBER: string;
  @IsString()
  SENDGRID_API_KEY: string;
  @IsString()
  SENDGRID_EMAIL: string;
  @IsString()
  APP_NAME: string;
  @IsNumber()
  TROTTLER_TTL: number;
  @IsNumber()
  TROTTLER_LIMIT: number;
  @IsString()
  JWT_SECRET_TOKEN: string;
  @IsString()
  JWT_SECRET_TOKEN_EXP: string;
  @IsString()
  ALLOWED_ORIGINS: string;
  @IsString()
  SECRET_COOKIE_SESSION: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
