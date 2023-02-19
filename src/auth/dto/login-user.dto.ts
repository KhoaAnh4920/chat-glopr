import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ required: true, example: 'khoaanh4920@gmail.com' })
  @IsDefined()
  @IsString()
  readonly identity!: string;

  @ApiProperty({ required: true, example: '12345678' })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  password: string;
}

export class ResponseLoginUserDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'SIGN_IN_SUCCESSFULLY' })
  message: string;

  @ApiProperty({
    example: {
      access_token: 'AAA',
      refreshToken: 'bbb',
      info: {
        id: '63b27f12b7aa9e3ac3a71a7e',
        email: 'khoaanh4920@gmail.com',
        fullName: 'Nguyễn Anh Khoa',
        userName: 'khoaanh4920',
        phoneNumber: '0968617132',
      },
    },
  })
  data: {
    access_token: string;
    refreshToken: string;
    info: {
      id: string;
      email: string;
      fullName: string;
      userName: string;
      phoneNumber: string;
    };
  };
}
