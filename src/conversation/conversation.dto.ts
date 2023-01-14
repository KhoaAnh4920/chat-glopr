import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsEnum,
} from 'class-validator';
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
}

export class PayloadGetOneDto {
  @ApiProperty({ required: true, example: '63bbb7750f7ee98af3cc67f9' })
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
