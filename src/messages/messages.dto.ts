import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  IsEmail,
  IsNotEmpty,
  IsPositive,
  Min,
  Max,
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

export class GetListMessageDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  page: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  @Max(50)
  @Type(() => Number)
  pageSize?: number;
}

export class ParamsGetConversationDto {
  @ApiProperty({ required: true, example: '63be4eb7051727fa65feaaf4' })
  @IsDefined()
  @IsString()
  readonly converId!: string;
}
