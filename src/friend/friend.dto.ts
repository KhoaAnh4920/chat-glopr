import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
import { ResponseMessage } from 'src/shared/response';

export class PayloadSendRequestDto {
  @ApiProperty({ required: true, example: '63b52af3ca78739b1c94eb52' })
  @IsDefined()
  @IsString()
  readonly userId!: string;
}

export class ListInviteResponeDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: ResponseMessage.GET_DATA_SUCCEEDED })
  message: string;

  @ApiProperty({
    example: [
      {
        _id: '63b27f12b7aa9e3ac3a71a7e',
        userName: 'khoaanh4920',
        avatar:
          'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
      },
    ],
  })
  data: [{ _id: string; userName: string; avatar: string }];
}
