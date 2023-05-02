import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { FcmStatus } from './notification.enum';

export class NotificationDto {
  @ApiProperty({
    example: 'string',
    required: true,
  })
  @IsString()
  @Type(() => String)
  fcmToken: string;

  @ApiProperty({
    example: 'string',
    required: true,
  })
  @IsString()
  @Type(() => String)
  deviceUuid: string;
}

export class DeleteFCMDto {
  @ApiProperty({
    example: 'string',
    required: true,
  })
  @IsString()
  @Type(() => String)
  deviceUuid: string;
}

export class ResponseFCMTokenDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'SIGN_IN_SUCCESSFULLY' })
  message: string;

  @ApiProperty({
    example: {
      fcm_token: 'string',
      device_uuid: 'string',
      status: FcmStatus.ACTIVE,
      isDeleted: false,
      userId: 'string',
      createdAt: '2023-05-02T07:46:32.708Z',
      updatedAt: '2023-05-02T07:46:32.708Z',
      id: 'string',
    },
  })
  data: {
    fcm_token: string;
    device_uuid: string;
    status: string;
    isDeleted: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    id: string;
  };
}
