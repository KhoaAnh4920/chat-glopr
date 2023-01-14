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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ConversationService } from './conversation.service';
import { Response } from 'express';
import { IEmptyDataRes, ISingleRes } from 'src/shared/response';
import { CurrentUser, ICurrentUser, SetScopes } from '../shared/auth';
import { ResponseMessage } from 'src/shared/response';
import {
  GetListConversationDto,
  ParamsDeleteConversationGroupDto,
  ParamsLeaveGroupGroupDto,
  PayloadAddMemberGroupDto,
  PayloadCreateGroupDto,
  PayloadCreateIndividualDto,
  PayloadDeleteMemberGroupDto,
  PayloadGetMemberDto,
  PayloadGetOneDto,
} from './conversation.dto';
import { MessagingGateway } from 'src/gateway/gateway';
import { ICreateIndividual, ISummaryConversation } from './consersation.type';
import { ParticipantsService } from 'src/participants/participants.service';
import { ParticipantsDocument } from 'src/_schemas/participants.schema';

@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly messagingGateway: MessagingGateway,
    private readonly participantsService: ParticipantsService,
  ) {}

  @ApiTags('Conversation')
  @Post('/individuals/:userId')
  @ApiOperation({ summary: 'Create a personal conversation' })
  @ApiBearerAuth()
  @SetScopes('user.conversation.create')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Create a personal conversation',
  })
  public async createIndividualConversation(
    @Body() payload: PayloadCreateIndividualDto,
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.conversationService.createIndividualConversation(
      currentUser.userId,
      payload.userId,
    );
    if (!result.isExists)
      this.messagingGateway.server
        .to(payload.userId + '')
        .emit('create-individual-conversation', result._id);
    const singleRes: ISingleRes<ICreateIndividual> = {
      success: true,
      statusCode: 201,
      message: ResponseMessage.CREATE_SUCCESS,
      data: result,
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }

  @ApiTags('Conversation')
  @Get()
  @ApiBearerAuth()
  @SetScopes('user.conversation.get')
  @ApiOperation({ summary: 'Get list conversation' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Get list conversation',
  })
  public async getList(
    @Query() query: GetListConversationDto,
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    let data = null;
    if (+query.type === 0)
      data = await this.conversationService.getList(currentUser.userId);
    if (+query.type == 1)
      data = await this.conversationService.getListIndividual(
        query.name || '',
        currentUser.userId,
      );
    if (+query.type == 2)
      data = await this.conversationService.getListGroup(
        query.name || '',
        currentUser.userId,
      );
    const resBody: ISingleRes<ISummaryConversation[]> = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.GET_DATA_SUCCEEDED,
      data: data,
    };

    return res.status(HttpStatus.OK).send(resBody);
  }

  @ApiTags('Conversation')
  @Get('/:converId')
  @ApiBearerAuth()
  @SetScopes('user.conversation.get')
  @ApiOperation({ summary: 'Get one conversation' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Get one conversation',
  })
  public async getOneConversation(
    @Param() params: PayloadGetOneDto,
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const dataRes = await this.conversationService.getSummaryByIdAndUserId(
      params.converId,
      currentUser.userId,
    );
    const resBody: ISingleRes<ISummaryConversation> = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.GET_DATA_SUCCEEDED,
      data: dataRes,
    };

    return res.status(HttpStatus.OK).send(resBody);
  }

  @ApiTags('Conversation')
  @Post('/group')
  @ApiOperation({ summary: 'Create a group conversation' })
  @ApiBearerAuth()
  @SetScopes('user.conversation.create')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Create a group conversation',
  })
  public async createGroupConversation(
    @Body() payload: PayloadCreateGroupDto,
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const conversationId =
      await this.conversationService.createGroupConversation(
        currentUser.userId,
        payload.name,
        payload.userIds,
      );
    // Fire socket //
    const resBody: ISingleRes<string> = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.CREATE_SUCCESS,
      data: conversationId,
    };

    return res.status(HttpStatus.OK).send(resBody);
  }

  @ApiTags('Conversation')
  @Get('/:id/members')
  @ApiBearerAuth()
  @SetScopes('user.conversation.get')
  @ApiOperation({ summary: 'Get member of conversation' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Get member of conversation',
  })
  public async getListMembers(
    @Param() params: PayloadGetMemberDto,
    @Res() res: Response,
  ) {
    const users = await this.participantsService.getListMemberOfConversation(
      params.id,
    );
    const resBody: ISingleRes<ParticipantsDocument[]> = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.CREATE_SUCCESS,
      data: users,
    };

    return res.status(HttpStatus.OK).send(resBody);
  }

  @ApiTags('Conversation')
  @Post('members')
  @ApiOperation({ summary: 'Add member to conversation' })
  @ApiBearerAuth()
  @SetScopes('user.conversation.create')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Add member to conversation',
  })
  public async addMemberToConversation(
    @Body() payload: PayloadAddMemberGroupDto,
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const dataRes = await this.conversationService.addMemberToConversation(
      currentUser.userId,
      payload.converId,
      payload.userIds,
    );
    // Fire socket //
    this.messagingGateway.server
      .to(payload.converId)
      .emit('new-message', payload.converId, dataRes);
    payload.userIds.forEach((userIdEle) =>
      this.messagingGateway.server
        .to(userIdEle)
        .emit('added-group', payload.converId),
    );
    this.messagingGateway.server
      .to(payload.converId)
      .emit('update-member', payload.converId);
    const resBody: IEmptyDataRes = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.CREATE_SUCCESS,
      data: [],
    };

    return res.status(HttpStatus.OK).send(resBody);
  }

  @ApiTags('Conversation')
  @Delete('/:converId/members/:userId')
  @ApiOperation({ summary: 'Delete member' })
  @ApiBearerAuth()
  @SetScopes('user.conversation.delete')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Delete member',
  })
  public async deleteMember(
    @Param() params: PayloadDeleteMemberGroupDto,
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const dataRes = await this.conversationService.deleteMember(
      currentUser.userId,
      params.converId,
      params.userId,
    );
    // Fire socket //
    this.messagingGateway.server
      .to(params.converId)
      .emit('new-message', params.converId, dataRes);
    this.messagingGateway.server
      .to(params.userId)
      .emit('deleted-group', params.converId);
    this.messagingGateway.server
      .to(params.converId)
      .emit('update-member', params.converId);
    const resBody: IEmptyDataRes = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.DELETE_DATA_SUCCEEDED,
      data: [],
    };

    return res.status(HttpStatus.OK).send(resBody);
  }

  @ApiTags('Conversation')
  @Delete('/:converId/members/leave')
  @ApiOperation({ summary: 'Leave group' })
  @ApiBearerAuth()
  @SetScopes('user.conversation.delete')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Leave group',
  })
  public async leaveGroup(
    @Param() params: ParamsLeaveGroupGroupDto,
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const dataRes = await this.conversationService.leaveGroup(
      params.converId,
      currentUser.userId,
    );
    // Fire socket //
    this.messagingGateway.server
      .to(params.converId)
      .emit('new-message', params.converId, dataRes);
    this.messagingGateway.server
      .to(params.converId)
      .emit('update-member', params.converId);
    const resBody: IEmptyDataRes = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.DELETE_DATA_SUCCEEDED,
      data: [],
    };

    return res.status(HttpStatus.OK).send(resBody);
  }

  @ApiTags('Conversation')
  @Delete('/:converId')
  @ApiOperation({ summary: 'Delete conversation' })
  @ApiBearerAuth()
  @SetScopes('user.conversation.delete')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Delete conversation',
  })
  public async deleteConversation(
    @Param() params: ParamsDeleteConversationGroupDto,
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    console.log('params: ', params);
    await this.conversationService.deleteConversation(
      params.converId,
      currentUser.userId,
    );
    const resBody: IEmptyDataRes = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.DELETE_DATA_SUCCEEDED,
      data: [],
    };

    return res.status(HttpStatus.OK).send(resBody);
  }
}
