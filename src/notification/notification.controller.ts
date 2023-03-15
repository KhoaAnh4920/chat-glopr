import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { IEmptyDataRes, ISingleRes } from 'src/shared/response';
import { CurrentUser, ICurrentUser, SetScopes } from '../shared/auth';
import { ResponseMessage } from 'src/shared/response';
import { MessagingPayloadDto } from './notification.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiTags('Notification')
  @Post('send')
  @ApiOperation({ summary: 'Send Notification' })
  @ApiBearerAuth()
  @SetScopes('user.notification.create')
  @ApiOkResponse({
    description: 'Add nickname for member of conversation',
    status: HttpStatus.OK,
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'CREATE_SUCCESS',
        data: [],
      },
    },
  })
  public async sendNotification(
    @Body() payload: MessagingPayloadDto,
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    console.log('Check payload: ', payload);
    const test = await this.notificationService.sendNotification(payload);

    const resBody: ISingleRes<any> = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.CREATE_SUCCESS,
      data: test,
    };

    return res.status(HttpStatus.OK).send(resBody);
  }
}
