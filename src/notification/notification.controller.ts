import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ApiException } from 'src/shared/common/api-exception.model';
import { NotificationService } from './notification.service';
import { CurrentUser, ICurrentUser, SetScopes } from 'src/shared/auth';
import {
  DeleteFCMDto,
  NotificationDto,
  ResponseFCMTokenDto,
} from './notification.type';
import { IEmptyDataRes, IEmptyRes, ISingleRes } from 'src/shared/response';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('/fcm-token')
  @ApiBearerAuth()
  @SetScopes('user.add.token')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseFCMTokenDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid input',
  })
  async addFcmToken(
    @Body() notiDto: NotificationDto,
    @CurrentUser() currentUser: ICurrentUser,
    @Res() res: Response,
  ) {
    const test = await this.notificationService.addFcmToken(
      notiDto,
      currentUser.userId,
    );
    const bodyResponse: ISingleRes<any> = {
      success: true,
      statusCode: 200,
      message: 'ADD_FCM_TOKEN_SUCCESSFULLY',
      data: test,
    };
    return res.status(HttpStatus.OK).send(bodyResponse);
  }

  @Delete('/fcm-token')
  @ApiBearerAuth()
  @SetScopes('user.delete.token')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseFCMTokenDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid input',
  })
  async deleteFcmToken(
    @Body() notiDto: DeleteFCMDto,
    @CurrentUser() currentUser: ICurrentUser,
    @Res() res: Response,
  ) {
    await this.notificationService.deleteFcmToken(notiDto, currentUser.userId);
    const bodyResponse: IEmptyRes = {
      success: true,
    };
    return res.status(HttpStatus.OK).send(bodyResponse);
  }
}
