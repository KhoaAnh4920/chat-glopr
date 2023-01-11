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
import { typeMessage } from './messages.enum';

export class PayloadSendTextMessageDto {
  @ApiProperty({ required: true, example: 'Phu noi nhieu' })
  @IsDefined()
  @IsString()
  readonly content: string;

  @ApiProperty({ required: true, example: typeMessage.TEXT })
  @IsDefined()
  @IsString()
  readonly type: typeMessage;

  @ApiProperty({
    required: true,
    example: '63b7f12e4b881f8db128428d',
    description: 'ConversationId or userId',
  })
  @IsDefined()
  @IsString()
  readonly desId: string;
}
