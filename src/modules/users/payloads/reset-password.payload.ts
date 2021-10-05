import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsString,
  IsMobilePhone,
  Matches,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { LoginPayload, mediumRegex } from './login.payloads';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordPayload extends LoginPayload {

  @ApiProperty({ required: true, minimum: 8, maximum: 1024 })
  @ApiModelProperty({
    description: 'The new password of the User',
    format: 'string',
    minLength: 8,
    maxLength: 1024,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(1024)
  newPassword: string;

  @ApiProperty({ required: true })
  @ApiModelProperty({
    example: '+972546556585',
    description: 'Mobile phone number of the User',
    format: 'mobile',
  })
  @IsNotEmpty()
  @IsMobilePhone()
  @IsString()
  mobilePhone: string;
}
