import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ResponseMessage } from 'src/shared/response';
import { typeSearchConversation } from './conversation.enum';

export class PayloadCreateIndividualDto {
  @ApiProperty({ required: true, example: '63b52af3ca78739b1c94eb52' })
  @IsDefined()
  @IsString()
  readonly userId!: string;
}

export class PayloadCreateGroupDto {
  @ApiProperty({ required: true, example: 'Ăn chơi lành mạnh', default: '' })
  @IsDefined()
  @IsString()
  readonly name!: string;

  @ApiProperty({
    required: true,
    type: [String],
    example: ['63b52af3ca78739b1c94eb52'],
    default: [],
  })
  @IsDefined()
  readonly userIds!: string[];
}

export class PayloadAddMemberGroupDto {
  @ApiProperty({ required: true, example: '63be4eb7051727fa65feaaf4' })
  @IsDefined()
  @IsString()
  readonly converId!: string;

  @ApiProperty({
    required: true,
    type: [String],
    example: ['63b52af3ca78739b1c94eb52'],
    default: [],
  })
  @IsDefined()
  readonly userIds!: string[];
}

export class PayloadDeleteMemberGroupDto {
  @ApiProperty({ required: true, example: '63be4eb7051727fa65feaaf4' })
  @IsDefined()
  @IsString()
  readonly converId!: string;

  @ApiProperty({
    required: true,
    type: String,
    example: '63b52af3ca78739b1c94eb52',
  })
  @IsDefined()
  readonly userId!: string;
}

export class ParamsDeleteConversationGroupDto {
  @ApiProperty({ required: true, example: '63be4eb7051727fa65feaaf4' })
  @IsDefined()
  @IsString()
  readonly converId!: string;
}

export class ParamsLeaveGroupGroupDto {
  @ApiProperty({ required: true, example: '63be4eb7051727fa65feaaf4' })
  @IsDefined()
  @IsString()
  readonly converId!: string;
}

export class GetListConversationDto {
  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    required: false,
    example: typeSearchConversation.ALL,
    default: typeSearchConversation.ALL,
  })
  @IsOptional()
  @IsEnum(typeSearchConversation)
  @Type(() => Number)
  readonly type?: typeSearchConversation;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  @Max(50)
  @Type(() => Number)
  pageSize?: number;
}

export class PayloadGetOneDto {
  @ApiProperty({ required: true, example: '63be4eb7051727fa65feaaf4' })
  @IsDefined()
  @IsString()
  readonly converId!: string;
}

export class PayloadGetMemberDto {
  @ApiProperty({ required: true, example: '63be4eb7051727fa65feaaf4' })
  @IsDefined()
  @IsString()
  readonly id!: string;
}

export class ListConversationResponeDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: ResponseMessage.GET_DATA_SUCCEEDED })
  message: string;

  @ApiProperty({
    example: [
      {
        id: 0,
        name: 'Ăn chơi lành mạnh',
        image: [
          {
            avatar:
              'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
          },
          {
            avatar:
              'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
          },
          {
            avatar:
              'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
          },
        ],
        type: true,
        totalMembers: 3,
        numberUnread: 0,
        lastMessage: {
          _id: 0,
          content: 'https://tinhte.vn/',
          type: 'LINK',
          conversationId: 0,
          reacts: [],
          options: [],
          createdAt: '21 giờ',
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
        isNotify: true,
        isJoinFromLink: false,
      },
      {
        _id: 0,
        name: 'Nguyen Nhat Huy',
        avatar:
          'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
        userId: 0,
        friendStatus: 'FOLLOWER',
        isOnline: false,
        lastLogin: null,
        type: false,
        totalMembers: 2,
        numberUnread: 0,
        lastMessage: {
          _id: 0,
          content: 'betis',
          type: 'TEXT',
          conversationId: 0,
          createdAt: '22/1',
          replyMessage: {},
          participants: [
            {
              userId: 0,
            },
            {
              userId: 0,
            },
          ],
          user: {
            _id: 0,
            avatar:
              'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
          },
          reacts: [],
        },
        isNotify: true,
        isJoinFromLink: false,
      },
    ],
  })
  data: [
    {
      _id: string;
      name: string;
      image: any;
      type: boolean;
      totalMembers: number;
      numberUnread: number;
      lastMessage: any;
      isNotify: boolean;
      isJoinFromLink: boolean;
    },
  ];
}

export class GetOneConversationResponeDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: ResponseMessage.GET_DATA_SUCCEEDED })
  message: string;

  @ApiProperty({
    example: {
      _id: 0,
      name: 'Ăn chơi lành mạnh',
      image: [
        {
          avatar:
            'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
        },
        {
          avatar:
            'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
        },
        {
          avatar:
            'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
        },
      ],
      type: true,
      totalMembers: 3,
      numberUnread: 0,
      lastMessage: {
        id: 0,
        content: 'https://tinhte.vn/',
        type: 'LINK',
        conversationId: 0,
        reacts: [],
        options: [],
        createdAt: '21 giờ',
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
      isNotify: true,
      isJoinFromLink: false,
    },
  })
  data: {
    _id: string;
    name: string;
    image: any;
    type: boolean;
    totalMembers: number;
    numberUnread: number;
    lastMessage: any;
    isNotify: boolean;
    isJoinFromLink: boolean;
  };
}

export class CreateConversationResponeDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: ResponseMessage.CREATE_SUCCESS })
  message: string;

  @ApiProperty({
    example: {
      conversationId: 0,
    },
  })
  data: {
    conversationId: string;
  };
}

export class GetLinkConversationResponeDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: ResponseMessage.CREATE_SUCCESS })
  message: string;

  @ApiProperty({
    example: [
      {
        id: 0,
        fullName: 'Phan Chau Duc',
        userName: 'duckphan1811',
        avatar:
          'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
      },
      {
        id: 0,
        fullName: 'Nguyễn Anh Khoa',
        userName: 'khoaanh4920',
        avatar:
          'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
      },
    ],
  })
  data: [
    {
      id: string;
      fullName: string;
      userName: string;
      avatar: string;
    },
  ];
}

export class PayloadCreateRolesDto {
  @ApiProperty({ required: true, example: 'Mobile team', default: '' })
  @IsDefined()
  @IsString()
  readonly name!: string;

  @ApiProperty({ required: true, example: '63be4eb7051727fa65feaaf4' })
  @IsDefined()
  @IsString()
  readonly converId!: string;

  @ApiProperty({
    required: true,
    type: [String],
    example: ['63b52af3ca78739b1c94eb52'],
    default: [],
  })
  @IsOptional()
  readonly userIds?: string[];
}

export class PayloadCreateNicknameDto {
  @ApiProperty({ required: true, example: 'Cam on vi da den', default: '' })
  @IsDefined()
  @IsString()
  readonly name!: string;

  @ApiProperty({ required: true, example: '63be4eb7051727fa65feaaf4' })
  @IsDefined()
  @IsString()
  readonly converId!: string;

  @ApiProperty({
    required: true,
    type: String,
    example: '63b52af3ca78739b1c94eb52',
  })
  @IsDefined()
  readonly userId!: string;
}

export class ParamGetRolesDto {
  @ApiProperty({
    required: false,
    example: '63be4eb7051727fa65feaaf4',
    type: String,
  })
  @IsDefined()
  @IsString()
  readonly converId: any;
}
