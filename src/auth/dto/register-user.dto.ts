import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsDate,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
export class RegisterUserDto {
  @ApiProperty({
    example: 'Pham Xuan Dinh',
    required: true,
  })
  @IsString()
  @Type(() => String)
  fullName?: string;

  @ApiProperty({
    example: 'khoaanh4920',
    required: true,
  })
  @IsString()
  @Type(() => String)
  userName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '0901234567', description: 'Phone number' })
  @IsDefined()
  @MinLength(10)
  @MaxLength(15)
  phoneNumber!: string;

  @ApiProperty()
  @IsDefined()
  otpCode!: string;

  // @ApiProperty({ example: 1607335220000 })
  // @IsOptional()
  // @IsDate()
  // @Type(() => Date)
  // dob?: Date;
}

export class ResponseRegisterUserDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'REGISTRATION_SUCCESS' })
  message: string;

  @ApiProperty({
    example: {
      _id: '63b27f12b7aa9e3ac3a71a7e',
      email: 'khoaanh4920@gmail.com',
      phoneNumber: '0968617132',
      fullName: 'Nguyễn Anh Khoa',
      username: 'khoaanh4920',
      gender: 'MALE',
      avatar:
        'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
      isDelete: false,
    },
  })
  data: {
    _id: string;
    email: string;
    phoneNumber: string;
    fullName: string;
    username: string;
    gender: string;
    avatar: string;
    isDelete: boolean;
  };
}
