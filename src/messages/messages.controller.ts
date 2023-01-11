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
import { MessagingGateway } from 'src/gateway/gateway';
import { MessagesService } from './messages.service';
import { Response } from 'express';
import { IEmptyDataRes, ISingleRes } from 'src/shared/response';
import { CurrentUser, ICurrentUser, SetScopes } from '../shared/auth';
import { ResponseMessage } from 'src/shared/response';
import { PayloadSendTextMessageDto } from './messages.dto';
import { CreateTextMessageViewReq, IMessagesResponse } from './messages.type';
import { ConversationService } from 'src/conversation/conversation.service';

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
  @SetScopes('user.conversation.create')
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

    const payloadSendMess = new CreateTextMessageViewReq(
      payload.content,
      payload.type,
      conversationId,
    );
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
}
