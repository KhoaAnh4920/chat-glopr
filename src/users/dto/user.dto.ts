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
import { Type } from 'class-transformer';
import { UserGender } from '../users.enum';

export class RequestSendOTPDto {
  @ApiProperty({
    example: 'RESET_PASSWORD | CREATE_USERS | DELETE_ACCOUNT',
    description: 'Context of verify OTP',
  })
  @IsEnum(ContentRequestOTP)
  context!: ContentRequestOTP;

  @ApiProperty({ example: '0968617132' })
  @IsDefined()
  @IsString()
  identity!: string;

  @ApiProperty({
    type: String,
    enum: TypeSender,
    example: 'SMS',
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

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  readonly fullName?: string;

  @ApiProperty({ example: '0901234567', description: 'Phone number' })
  @IsOptional()
  @MinLength(10)
  @MaxLength(15)
  phoneNumber?: string;

  @ApiProperty({ enum: UserGender, required: false })
  @IsOptional()
  @IsString()
  readonly gender?: UserGender;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly dob?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly avatar?: string;
}
