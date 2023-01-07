import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
import { Types } from 'mongoose';

export class PayloadSendRequestDto {
  @ApiProperty({ required: true, example: '63b52af3ca78739b1c94eb52' })
  @IsDefined()
  @IsString()
  readonly userId!: string;
}
