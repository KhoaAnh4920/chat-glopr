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
import { UserGender } from 'src/users/users.enum';
import { Matches } from 'class-validator';
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
    required: false,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  userName?: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsEmail()
  // email: string;

  @ApiProperty({
    required: true,
    example: 'khoaanh4920@gmail.com | 0968617132',
  })
  @IsDefined()
  @Matches(/^([0-9]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})$/, {
    message: 'Identity must be email address or phone number',
  })
  readonly identity!: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  // @ApiProperty({ example: '0901234567', description: 'Phone number' })
  // @IsDefined()
  // @MinLength(10)
  // @MaxLength(15)
  // phoneNumber!: string;

  @ApiProperty()
  @IsDefined()
  otpCode!: string;

  @ApiProperty({ enum: UserGender, required: false })
  @IsOptional()
  @IsString()
  readonly gender?: UserGender;

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
      id: '63b27f12b7aa9e3ac3a71a7e',
      email: 'khoaanh4920@gmail.com',
      phoneNumber: '0968617132',
      fullName: 'Nguyễn Anh Khoa',
      userName: 'khoaanh4920',
      gender: 'MALE',
      avatar:
        'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
      isDelete: false,
    },
  })
  data: {
    id: string;
    email: string;
    phoneNumber: string;
    fullName: string;
    userName: string;
    gender: string;
    avatar: string;
    isDelete: boolean;
  };
}
