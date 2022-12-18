import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsNumberString,
  IsNumber,
  Min,
  IsEnum,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { ContentRequestOTP, TypeSender } from '../../otp/otp.enum';
import { RandomTypes } from '../../shared/common/stringUtils';
import { OTP_LENGTH } from '../../otp/otp.constant';

export class RequestSendOTPDto {
  @ApiProperty({
    example: 'RESET_PASSWORD | CREATE_USERS | DELETE_ACCOUNT',
    description: 'Context of verify OTP',
  })
  @IsEnum(ContentRequestOTP)
  context!: ContentRequestOTP;

  @ApiProperty()
  @IsDefined()
  @IsString()
  identity!: string;

  @ApiProperty({
    type: String,
    enum: TypeSender,
    example: 'EMAIL | SMS',
    description: 'Type Send',
  })
  @IsEnum(TypeSender)
  method!: TypeSender;

  @ApiProperty({
    type: String,
    enum: RandomTypes,
    example: 'STRING_ONLY | NUMBER_ONLY | STRING_NUMBER',
    description: 'OTP format',
  })
  @IsEnum(RandomTypes)
  format!: RandomTypes;
}

export class ValidateOTPDto {
  @ApiProperty({
    example: 'CREATE_USERS | RESET_PASSWORD | DELETE_ACCOUNT',
    description: 'Context of verify OTP',
  })
  @IsEnum(ContentRequestOTP)
  context!: ContentRequestOTP;

  @ApiProperty()
  @IsDefined()
  @IsString()
  identity!: string;

  @ApiProperty({ example: 'CdC6GG', description: 'OTP' })
  @IsString()
  @MaxLength(OTP_LENGTH)
  otpCode!: string;
}

export class ResetPasswordOtpDto {
  @ApiProperty({ example: 'CdC6GG', description: 'OTP' })
  @IsString()
  @MaxLength(6)
  otpToken!: string;

  @ApiProperty()
  @IsString()
  password!: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  identity!: string;
}
