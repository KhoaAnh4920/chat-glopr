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
import { ResponseMessage } from 'src/shared/response';

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

export class PayloadGetSummaryUserDto {
  @ApiProperty({ required: true, example: 'khoaanh4920' })
  @IsDefined()
  @IsString()
  readonly userName?: string;
}

export class SearchUserDto {
  @ApiProperty({ required: false, example: 'Phu Ngoc Thuy' })
  @IsOptional()
  @IsString()
  readonly key?: string;
}

export class PayloadGetDetailUserDto {
  @ApiProperty({ required: false, example: '63b52a80c9ab02b403f2da8e' })
  @IsOptional()
  @IsString()
  readonly key?: string;
}

export class OtpResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'CREATE_SUCCESS' })
  message: string;

  @ApiProperty({ example: { otpCode: '1234' } })
  data: {
    otpCode: string;
  };
}

export class GetInfoUserResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: ResponseMessage.GET_DATA_SUCCEEDED })
  message: string;

  @ApiProperty({
    example: {
      id: '63b27f12b7aa9e3ac3a71a7e',
      email: 'khoaanh4920@gmail.com',
      phoneNumber: '123456789',
      fullName: 'Nguyễn Anh Khoa',
      userName: 'khoaanh4920',
      dob: '2000-09-04T09:16:27.574Z',
      avatar:
        'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
      gender: 'MALE',
      isActived: false,
      isDeleted: false,
      createdAt: '2023-01-02T06:52:02.305Z',
      updatedAt: '2023-01-02T06:52:02.305Z',
    },
  })
  data: {
    _id: string;
    email: string;
    phoneNumber: string;
    fullName: string;
    userName: string;
    dob: Date;
    avatar: string;
    gender: string;
    isActived: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export class GetInfoSummaryUserResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: ResponseMessage.GET_DATA_SUCCEEDED })
  message: string;

  @ApiProperty({
    example: {
      fullName: 'Nguyễn Anh Khoa',
      userName: 'khoaanh4920',
      avatar:
        'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
      isActived: false,
    },
  })
  data: {
    fullName: string;
    userName: string;
    avatar: string;
    isActived: boolean;
  };
}

export class GetSearchUserSummaryUserResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: ResponseMessage.GET_DATA_SUCCEEDED })
  message: string;

  @ApiProperty({
    example: {
      fullName: 'Nguyễn Anh Khoa',
      userName: 'khoaanh4920',
      dob: null,
      avatar:
        'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
      gender: 'FEMALE',
      isActived: false,
    },
  })
  data: {
    fullName: string;
    userName: string;
    email: string;
    dob: Date;
    avatar: string;
    gender: string;
    isActived: boolean;
  };
}
