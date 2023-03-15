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
  IsPositive,
  Min,
  Max,
} from 'class-validator';
import { ResponseMessage } from 'src/shared/response';

export class MessagingPayloadDto {
  @ApiProperty({ required: true, example: 'Test title' })
  @IsDefined()
  @IsString()
  readonly title!: string;

  @ApiProperty({ required: true, example: 'Content lorem AAA' })
  @IsDefined()
  @IsString()
  readonly body!: string;

  @ApiProperty({
    required: true,
    example:
      'fSjxZQpOfU_VkJtnuZFysS:APA91bFZAw3khn4psp8pC2i_UHSiGxJSaHl_E6LT-u2cqiU8jwLDJGN2x862_LImB53B_BNSnfDkd114m_y0bW4cFkPDSYA8261gERDYEc83mUbpPYti4YbSDBx8gKW1I7ZI-MSb8z-b',
  })
  @IsDefined()
  @IsString()
  readonly token!: string;
}
