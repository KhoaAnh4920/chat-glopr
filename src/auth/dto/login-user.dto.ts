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
