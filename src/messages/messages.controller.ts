import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Message } from 'src/_schemas/message.schema';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessagingGateway } from 'src/gateway/gateway';
import { AppError, ERROR_CODE } from 'src/shared/error';
import {
  IEmptyDataRes,
  ISingleRes,
  ResponseMessage,
} from 'src/shared/response';
import { filesOptions } from 'src/upload/constants';
import { CurrentUser, ICurrentUser, SetScopes } from '../shared/auth';
import {
  GetListMessageDto,
  ParamsGetConversationDto,
  ParamsGetListFileConversationDto,
  ParamsIdMessageDto,
  ParamsReactionMessageDto,
  PayloadSearchMessageDto,
  PayloadSendFileMessageDto,
  PayloadSendTextMessageDto,
  SendTextMessageResponeDto,
} from './messages.dto';
import { TypeGetListAttachments, typeMessage } from './messages.enum';
import { MessagesService } from './messages.service';
import {
  CreateTextMessageViewReq,
  GetListMessageSlot,
  IGetListFileMessageSlot,
  IMessagesResponse,
  IResPinMessageSlot,
} from './messages.type';
const urlRegex = require('url-regex');

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messagingGateway: MessagingGateway,
    private readonly conversationService: ConversationService,
  ) {}

  @ApiTags('Messages')
  @Post('/text')
  @ApiOperation({ summary: 'Send text message' })
  @ApiBearerAuth()
  @SetScopes('user.message.send')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: `socket: firing emit('new-message', conversationId, message)`,
    type: SendTextMessageResponeDto,
  })
  public async addText(
    @Body() payload: PayloadSendTextMessageDto,
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const isExistsUrl = urlRegex().test(payload.content);
    const typeMess = isExistsUrl ? typeMessage.LINK : typeMessage.TEXT;
    // Check is exists conversation //
    let conversationId = payload.desId;
    const isExists = await this.conversationService.findOne(conversationId);
    if (!isExists) {
      const resConver =
        await this.conversationService.createIndividualConversation(
          currentUser.userId,
          payload.desId,
        );
      conversationId = resConver._id;
    }

    const payloadSendMess: CreateTextMessageViewReq = {
      content: payload.content,
      type: typeMess,
      conversationId: conversationId,
    };
    const dataMess = await this.messagesService.addText(
      payloadSendMess,
      currentUser.userId,
    );
    // this.messagingGateway.server
    //   .to(conversationId + '')
    //   .emit('new-message', conversationId, dataMess);

    this.messagingGateway.server.emit(
      'update-conversation-list',
      conversationId,
      dataMess,
    );

    const singleRes: ISingleRes<IMessagesResponse> = {
      success: true,
      statusCode: 201,
      message: ResponseMessage.CREATE_SUCCESS,
      data: dataMess,
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }

  @ApiTags('Messages')
  @Get('/:converId')
  @ApiBearerAuth()
  @SetScopes('user.messages.get')
  @ApiOperation({ summary: 'Get list message of conversation' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Get list message of conversation',
  })
  public async getList(
    @Query() query: GetListMessageDto,
    @Param() params: ParamsGetConversationDto,
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const payload = new GetListMessageSlot(
      params.converId,
      +query.page || 1,
      +query.pageSize || 20,
    );
    const result = await this.messagesService.getList(
      payload,
      currentUser.userId,
    );
    const singleRes: ISingleRes<IMessagesResponse[]> = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.GET_DATA_SUCCEEDED,
      data: result.messages,
      totalPages: result.total_pages,
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }

  @ApiTags('Messages')
  @Post('/files')
  @ApiOperation({ summary: 'Send file message' })
  @ApiBearerAuth()
  @SetScopes('user.message.send')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 100, filesOptions))
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: `socket: firing emit('new-message', conversationId, message)`,
  })
  public async addFile(
    @Body() data: PayloadSendFileMessageDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() currentUser: ICurrentUser,
    @Res() res: Response,
  ) {
    // Check is exists conversation //
    let conversationId = data.desId;
    const isExists = await this.conversationService.findOne(conversationId);
    if (!isExists) {
      const resConver =
        await this.conversationService.createIndividualConversation(
          currentUser.userId,
          data.desId,
        );
      conversationId = resConver._id;
    }
    const dataMess = await this.messagesService.addFiles(
      files,
      currentUser.userId,
      data.type,
      '',
      conversationId,
    );
    this.messagingGateway.server
      .to(conversationId + '')
      .emit('new-message', conversationId, dataMess);

    const singleRes: ISingleRes<IMessagesResponse> = {
      success: true,
      statusCode: 201,
      message: ResponseMessage.CREATE_SUCCESS,
      data: dataMess,
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }

  @ApiTags('Messages')
  @Get('/:converId/files')
  @ApiBearerAuth()
  @SetScopes('user.messages.get')
  @ApiOperation({ summary: 'Get list files of conversation' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Get list files of conversation',
  })
  public async getListFiles(
    @Query() query: ParamsGetListFileConversationDto,
    @Param() params: ParamsGetConversationDto,
    @CurrentUser() currentUser: ICurrentUser,
    @Res() res: Response,
  ) {
    // Check is valid type //
    const value = TypeGetListAttachments[query.type];
    if (!!!value) throw new AppError(ERROR_CODE.PARAM_INVALID);
    const data = await this.messagesService.getAllFiles(
      params.converId,
      currentUser.userId,
      query.type,
    );

    const singleRes: ISingleRes<IGetListFileMessageSlot> = {
      success: true,
      statusCode: 201,
      message: ResponseMessage.CREATE_SUCCESS,
      data: data,
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }

  @ApiTags('Messages')
  @Delete('/:id')
  @ApiBearerAuth()
  @SetScopes('user.messages.delete')
  @ApiOperation({ summary: 'Remove message' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Remove message',
  })
  public async deleteById(
    @Param() params: ParamsIdMessageDto,
    @CurrentUser() currentUser: ICurrentUser,
    @Res() res: Response,
  ) {
    const { conversationId, channelId } = await this.messagesService.deleteById(
      params.id,
      currentUser.userId,
    );

    this.messagingGateway.server
      .to(conversationId + '')
      .emit('delete-message', { conversationId, channelId, id: params.id });

    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @ApiTags('Messages')
  @Post('/pin/:id')
  @ApiBearerAuth()
  @SetScopes('user.messages.pin')
  @ApiOperation({ summary: 'Pin message' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Pin message',
  })
  public async addPinMessage(
    @Param() params: ParamsIdMessageDto,
    @CurrentUser() currentUser: ICurrentUser,
    @Res() res: Response,
  ) {
    const { conversationId, message } =
      await this.messagesService.addPinMessage(params.id, currentUser.userId);

    this.messagingGateway.server
      .to(conversationId + '')
      .emit('new-message', conversationId, message);

    this.messagingGateway.server
      .to(conversationId + '')
      .emit('action-pin-message', conversationId);

    const singleRes: ISingleRes<IResPinMessageSlot> = {
      success: true,
      statusCode: 201,
      message: ResponseMessage.CREATE_SUCCESS,
      data: { conversationId, message },
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }

  @ApiTags('Messages')
  @Get('/pin/:converId')
  @ApiBearerAuth()
  @SetScopes('user.messages.pin.get')
  @ApiOperation({ summary: 'Get list pin message' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Get list pin message',
  })
  public async getAllPinMessages(
    @Param() params: ParamsGetConversationDto,
    @CurrentUser() currentUser: ICurrentUser,
    @Res() res: Response,
  ) {
    console.log(params);
    const pinMessages = await this.messagesService.getAllPinMessages(
      params.converId,
      currentUser.userId,
    );
    // IMessagesResponse[]

    const singleRes: ISingleRes<IMessagesResponse[]> = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.GET_DATA_SUCCEEDED,
      data: pinMessages,
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }

  @ApiTags('Messages')
  @Delete('/pin/:id')
  @ApiBearerAuth()
  @SetScopes('user.messages.pin.delete')
  @ApiOperation({ summary: 'Remove pin message' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Remove pin message',
  })
  public async deletePinMessage(
    @Param() params: ParamsIdMessageDto,
    @CurrentUser() currentUser: ICurrentUser,
    @Res() res: Response,
  ) {
    const { conversationId, message } =
      await this.messagesService.deletePinMessage(
        params.id,
        currentUser.userId,
      );

    this.messagingGateway.server
      .to(conversationId + '')
      .emit('new-message', conversationId, message);

    this.messagingGateway.server
      .to(conversationId + '')
      .emit('action-pin-message', conversationId);

    const singleRes: ISingleRes<IResPinMessageSlot> = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.DELETE_DATA_SUCCEEDED,
      data: { conversationId, message },
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }

  @ApiTags('Messages')
  @Post('/:id/reacts/:type')
  @ApiBearerAuth()
  @SetScopes('user.messages.reacts')
  @ApiOperation({ summary: 'Add reaction for message' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Add reaction for message',
  })
  public async addReaction(
    @Param() params: ParamsReactionMessageDto,
    @CurrentUser() currentUser: ICurrentUser,
    @Res() res: Response,
  ) {
    const { user, conversationId } = await this.messagesService.addReaction(
      params.id,
      params.type,
      currentUser.userId,
    );

    this.messagingGateway.server.to(conversationId + '').emit('add-reaction', {
      conversationId,
      messageId: params.id,
      user,
      type: params.type,
    });

    const singleRes: IEmptyDataRes = {
      success: true,
      statusCode: 201,
      message: ResponseMessage.CREATE_SUCCESS,
      data: [],
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }

  @ApiTags('Messages')
  @Post('/search')
  @ApiBearerAuth()
  @SetScopes('user.messages.search')
  @ApiOperation({ summary: 'Search message' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Search message',
  })
  public async searchMessage(
    @Body() payload: PayloadSearchMessageDto,
    @CurrentUser() currentUser: ICurrentUser,
    @Res() res: Response,
  ) {
    const dataMess = await this.messagesService.searchMessage({
      ...payload,
      userId: currentUser.userId,
    });

    const singleRes: ISingleRes<Message[]> = {
      success: true,
      statusCode: 200,
      message: ResponseMessage.DELETE_DATA_SUCCEEDED,
      data: dataMess,
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }
}
