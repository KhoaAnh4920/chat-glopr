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
import { TypeGetListAttachments, typeMessage } from './messages.enum';

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
    example: '63be4eb7051727fa65feaaf4',
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

export class ParamsIdMessageDto {
  @ApiProperty({ required: true, example: '63c24cf68aaec72d38f15eac' })
  @IsDefined()
  @IsString()
  readonly id!: string;
}

export class ParamsGetListFileConversationDto {
  @ApiProperty({
    required: false,
    example: TypeGetListAttachments.ALL,
    default: TypeGetListAttachments.ALL,
  })
  @IsDefined()
  @IsString()
  readonly type: TypeGetListAttachments;
}
export class itemFiles {
  public type: 'string';
  public format: 'binary';
}

export class PayloadSendFileMessageDto {
  @ApiProperty({
    required: true,
    example: typeMessage.FILE,
  })
  @IsDefined()
  @IsString()
  readonly type: typeMessage;

  @ApiProperty({
    required: true,
    example: '63be4eb7051727fa65feaaf4',
    description: 'ConversationId or userId',
  })
  @IsDefined()
  @IsString()
  readonly desId: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: true,
    description:
      'Type: .png, .jpeg, .jpg, .gif, .mp3, .mp4, .pdf, .doc, .docx, .ppt, .pptx, .rar, .zip \n\n Max size: 20 MB',
  })
  files: Express.Multer.File;
}
