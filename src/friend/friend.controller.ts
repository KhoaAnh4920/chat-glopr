import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { IEmptyDataRes, ResponseMessage } from 'src/shared/response';
import { CurrentUser, ICurrentUser, SetScopes } from '../shared/auth';
import { ListInviteResponeDto, PayloadSendRequestDto } from './friend.dto';
import { FriendService } from './friend.service';
import { IDeleteFriendRequestViewReq } from './friend.type';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @ApiTags('Friend')
  @Post('/invites')
  @ApiOperation({ summary: 'Send friend request' })
  @ApiBearerAuth()
  @SetScopes('user.friend.request')
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      example: {
        success: true,
        statusCode: 201,
        message: ResponseMessage.CREATE_SUCCESS,
        data: [],
      },
    },
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

  @ApiTags('Friend')
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
    const result = await this.friendService.acceptFriendRequest(
      currentUser.userId,
      payload.userId,
    );

    const singleRes: any = {
      success: true,
      statusCode: 201,
      message: ResponseMessage.CREATE_SUCCESS,
      data: result,
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }

  @ApiTags('Friend')
  @Delete('/invites/:userId')
  @ApiOperation({ summary: 'Delete friend request' })
  @ApiBearerAuth()
  @SetScopes('user.friend.request')
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        success: true,
        statusCode: 201,
        message: ResponseMessage.DELETE_DATA_SUCCEEDED,
        data: [],
      },
    },
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

  @ApiTags('Friend')
  @Get('/invites/me')
  @ApiOperation({ summary: 'The list of friend requests sent by yourself' })
  @ApiBearerAuth()
  @SetScopes('user.friend.request')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ListInviteResponeDto,
  })
  public async getListInvitesWasSend(
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const users = await this.friendService.getListInvitesWasSend(
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

  @ApiTags('Friend')
  @Get('/invites')
  @ApiOperation({ summary: 'My friend request list' })
  @ApiBearerAuth()
  @SetScopes('user.friend.request')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ListInviteResponeDto,
  })
  public async getListFriendInvites(
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const users = await this.friendService.getListInvites(currentUser.userId);

    const singleRes = {
      success: true,
      statusCode: 201,
      message: ResponseMessage.GET_DATA_SUCCEEDED,
      data: users,
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }
  @ApiTags('Friend')
  @Get('')
  @ApiOperation({ summary: 'Get list friend' })
  @ApiBearerAuth()
  @SetScopes('user.friend.get')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ListInviteResponeDto,
  })
  public async getListFriends(
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const users = await this.friendService.getListFriends(
      '',
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
