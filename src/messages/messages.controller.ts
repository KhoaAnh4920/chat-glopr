import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { MessagingGateway } from 'src/gateway/gateway';
import { MessagesService } from './messages.service';
import { Response } from 'express';
import { IEmptyDataRes, ISingleRes } from 'src/shared/response';
import { CurrentUser, ICurrentUser, SetScopes } from '../shared/auth';
import { ResponseMessage } from 'src/shared/response';
import {
  ParamsGetConversationDto,
  GetListMessageDto,
  PayloadSendTextMessageDto,
  PayloadSendFileMessageDto,
  ParamsGetListFileConversationDto,
} from './messages.dto';
import {
  CreateTextMessageViewReq,
  GetListMessageSlot,
  IMessagesResponse,
} from './messages.type';
import { ConversationService } from 'src/conversation/conversation.service';
import { filesOptions } from 'src/upload/constants';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { TypeGetListAttachments, typeMessage } from './messages.enum';

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
  })
  public async addText(
    @Body() payload: PayloadSendTextMessageDto,
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
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
      type: payload.type,
      conversationId: conversationId,
    };
    const dataMess = await this.messagesService.addText(
      payloadSendMess,
      currentUser.userId,
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
      data: result,
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
    // Check is exists conversation //
    console.log(query);
    let files = null;
    // if (query.type === TypeGetListAttachments.ALL)
    //   files = await this.messagesService.getAllFiles(
    //     params.converId,
    //     currentUser.userId,
    //   );
    files = await this.messagesService.getAllFiles(
      params.converId,
      currentUser.userId,
    );

    const singleRes: ISingleRes<any> = {
      success: true,
      statusCode: 201,
      message: ResponseMessage.CREATE_SUCCESS,
      data: files,
    };
    return res.status(HttpStatus.OK).send(singleRes);
  }
}
