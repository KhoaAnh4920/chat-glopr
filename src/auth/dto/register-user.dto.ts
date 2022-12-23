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
  phoneOtp!: string;

  // @ApiProperty({ example: 1607335220000 })
  // @IsOptional()
  // @IsDate()
  // @Type(() => Date)
  // dob?: Date;
}
