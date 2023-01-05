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
} from '@nestjs/common';
import { FriendService } from './friend.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { IEmptyDataRes, ISingleRes } from 'src/shared/response';
import { PayloadSendRequestDto } from './friend.dto';
import { CurrentUser, ICurrentUser, SetScopes } from '../shared/auth';
import { IDeleteFriendRequestViewReq } from './friend.type';
import { ResponseMessage } from 'src/shared/response';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @ApiTags('friend')
  @Post('/invites')
  @ApiOperation({ summary: 'Send friend request' })
  @ApiBearerAuth()
  @SetScopes('user.friend.request')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Send friend request',
  })
  public async sendFriendInvite(
    @Body() payload: PayloadSendRequestDto,
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    await this.friendService.sendFriendInvite(
      currentUser.userId,
      payload.userId,
    );

    const singleRes: IEmptyDataRes = {
      success: true,
      statusCode: 201,
      message: ResponseMessage.CREATE_SUCCESS,
      data: [],
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }

  @ApiTags('friend')
  @Post('')
  @ApiOperation({ summary: 'Accept friend request' })
  @ApiBearerAuth()
  @SetScopes('user.friend.request')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Accept friend request',
  })
  public async acceptFriendRequest(
    @Body() payload: PayloadSendRequestDto,
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    await this.friendService.acceptFriendRequest(
      currentUser.userId,
      payload.userId,
    );

    const singleRes: IEmptyDataRes = {
      success: true,
      statusCode: 201,
      message: ResponseMessage.CREATE_SUCCESS,
      data: [],
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }

  @ApiTags('friend')
  @Delete('/invites/:userId')
  @ApiOperation({ summary: 'Delete friend request' })
  @ApiBearerAuth()
  @SetScopes('user.friend.request')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Delete friend request',
  })
  public async deleteFriendRequest(
    @Param() params: PayloadSendRequestDto,
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const friendRequestService: IDeleteFriendRequestViewReq = {
      _id: currentUser.userId,
      userId: params.userId,
    };
    await this.friendService.deleteFriendRequest(friendRequestService);

    const singleRes: IEmptyDataRes = {
      success: true,
      statusCode: 201,
      message: ResponseMessage.DELETE_DATA_SUCCEEDED,
      data: [],
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }

  @ApiTags('friend')
  @Get('/invites/')
  @ApiOperation({ summary: 'Get friend request' })
  @ApiBearerAuth()
  @SetScopes('user.friend.request')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Get friend request',
  })
  public async getListFriendRequest(
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const users = await this.friendService.getListFriendRequest(
      currentUser.userId,
    );

    const singleRes = {
      success: true,
      statusCode: 201,
      message: ResponseMessage.GET_DATA_SUCCEEDED,
      data: users,
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }
}
