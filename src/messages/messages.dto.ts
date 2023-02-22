import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  IsPositive,
  Min,
  Max,
  IsNumber,
} from 'class-validator';
import { Types } from 'mongoose';
import { ResponseMessage } from 'src/shared/response';
import {
  TypeGetListAttachments,
  typeMessage,
  TypeReactMessage,
} from './messages.enum';

export class PayloadSendTextMessageDto {
  @ApiProperty({ required: true, example: 'Phu noi nhieu' })
  @IsDefined()
  @IsString()
  readonly content: string;

  // @ApiProperty({ required: true, example: typeMessage.TEXT })
  // @IsDefined()
  // @IsString()
  // readonly type: typeMessage;

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
    example: 'ALL | IMAGE | VIDEO | FILES | LINK',
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

export class ListMessageOfConversationResponeDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: ResponseMessage.CREATE_SUCCESS })
  message: string;

  @ApiProperty({
    example: [
      {
        _id: 0,
        content: 'https://tinhte.vn/',
        type: 'LINK',
        reacts: [],
        options: [],
        createdAt: '2023-02-11T09:05:27.283Z',
        user: {
          _id: 0,
          fullName: 'Nguyễn Anh Khoa',
          avatar:
            'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
        },
        manipulatedUsers: [],
        userOptions: [],
        replyMessage: null,
        tagUsers: [],
      },
      {
        _id: 0,
        content: '👉👈',
        type: 'TEXT',
        reacts: [],
        options: [],
        createdAt: '2023-02-12T08:27:12.985Z',
        user: {
          _id: 0,
          fullName: 'Nguyễn Anh Khoa',
          avatar:
            'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
        },
        manipulatedUsers: [],
        userOptions: [],
        replyMessage: null,
        tagUsers: [],
      },
    ],
  })
  data: [
    {
      _id: string;
      content: string;
      type: string;
      conversationId: string;
      reacts: any;
      options: any;
      createdAt: Date;
      user: any;
      manipulatedUsers: any;
      userOptions: any;
      replyMessage: any;
      tagUsers: any;
    },
  ];
}

export class SendTextMessageResponeDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: ResponseMessage.CREATE_SUCCESS })
  message: string;

  @ApiProperty({
    example: {
      _id: 1,
      content: '👉👈',
      type: 'TEXT',
      conversationId: 0,
      reacts: [],
      options: [],
      createdAt: '2023-02-12T08:27:12.985Z',
      user: {
        _id: 0,
        fullName: 'Nguyễn Anh Khoa',
        avatar:
          'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
      },
      manipulatedUsers: [],
      userOptions: [],
      replyMessage: null,
      tagUsers: [],
    },
  })
  data: [
    {
      _id: string;
      content: string;
      type: string;
      conversationId: string;
      reacts: any;
      options: any;
      createdAt: Date;
      user: any;
      manipulatedUsers: any;
      userOptions: any;
      replyMessage: any;
      tagUsers: any;
    },
  ];
}

export class ParamsReactionMessageDto {
  @ApiProperty({ required: true, example: '63c24cf68aaec72d38f15eac' })
  @IsDefined()
  @IsString()
  readonly id!: string;

  @ApiProperty({
    required: true,
    example: TypeReactMessage.LIKE,
  })
  @IsDefined()
  readonly type!: TypeReactMessage;
}
