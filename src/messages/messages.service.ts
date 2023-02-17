import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { ConversationService } from 'src/conversation/conversation.service';
import { ParticipantsService } from 'src/participants/participants.service';
import { MessagesRepository } from './message.repository';
import {
  ICreateTextMessageViewReq,
  IDeleteMessageRes,
  IGetListFileMessageSlot,
  IGetListMessageSlot,
  IMessagesResponse,
  IResPinMessageSlot,
} from './messages.type';
import { messageUtils } from '../shared/common/messageUtils';
import { ConversationRepository } from 'src/conversation/conversation.repository';
import { UploadService } from 'src/upload/upload.service';
import { Message } from 'src/_schemas/message.schema';
import { ObjectId } from 'mongoose';
import { AppError, ERROR_CODE } from 'src/shared/error';
import { TypeGetListAttachments, typeMessage } from './messages.enum';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,
    private readonly participantsService: ParticipantsService,
    private readonly conversationRepository: ConversationRepository,
    private readonly uploadService: UploadService,
  ) {}

  public async getById(
    _id: ObjectId | string,
    type: boolean,
  ): Promise<IMessagesResponse> {
    if (type) {
      const message = await this.messagesRepository.getByIdOfGroup(_id);
      return messageUtils.convertMessageOfGroup(message);
    }

    const message = await this.messagesRepository.getByIdOfIndividual(_id);
    return messageUtils.convertMessageOfIndividual(message);
  }

  public async getAllFiles(
    converId: string,
    userId: string,
    type: TypeGetListAttachments,
  ): Promise<IGetListFileMessageSlot> {
    if (type === TypeGetListAttachments.ALL) {
      const images =
        await this.messagesRepository.getListFilesByTypeAndConversationId(
          'IMAGE',
          converId,
          userId,
          0,
          8,
        );

      const videos =
        await this.messagesRepository.getListFilesByTypeAndConversationId(
          'VIDEO',
          converId,
          userId,
          0,
          8,
        );
      const files =
        await this.messagesRepository.getListFilesByTypeAndConversationId(
          'FILE',
          converId,
          userId,
          0,
          8,
        );
      messageUtils.convertImageStringToArray(files);
      const links =
        await this.messagesRepository.getListFilesByTypeAndConversationId(
          'LINK',
          converId,
          userId,
          0,
          8,
        );
      return {
        images,
        videos,
        files,
        links,
      };
    } else {
      const files =
        await this.messagesRepository.getListFilesByTypeAndConversationId(
          type,
          converId,
          userId,
          0,
          8,
        );
      return {
        files,
      };
    }
  }

  public async getList(
    payload: IGetListMessageSlot,
    userId: string,
  ): Promise<IMessagesResponse[]> {
    const conversation = await this.conversationRepository.getByIdAndUserId(
      payload.conversationId,
      userId,
    );
    const skip = (payload.page - 1) * payload.pageSize;
    let messages: IMessagesResponse[] = null;
    if (conversation.type) {
      const messagesTempt =
        await this.messagesRepository.getListByConversationIdAndUserIdOfGroup(
          payload.conversationId,
          userId,
          skip,
          payload.pageSize,
        );

      messages = messagesTempt.map((messageEle) =>
        messageUtils.convertMessageOfGroup(messageEle),
      );
    } else {
      const messagesTempt =
        await this.messagesRepository.getListByConversationIdAndUserIdOfIndividual(
          payload.conversationId,
          userId,
          skip,
          payload.pageSize,
        );
      messages = messagesTempt.map((messageEle) =>
        messageUtils.convertMessageOfIndividual(messageEle),
      );
    }
    await this.participantsService.updateLastViewOfConversation(
      payload.conversationId,
      userId,
    );

    return messages;
  }

  public async addText(
    message: ICreateTextMessageViewReq,
    userId: string,
  ): Promise<IMessagesResponse> {
    // validate //
    const { channelId, conversationId } = message;

    if (channelId) delete message.conversationId;

    await this.conversationRepository.resetUserDeleteConversation(
      conversationId,
    );

    const saveMessage = await this.messagesRepository.addText({
      userId: userId,
      content: message.content,
      type: message.type,
      conversationId: message.conversationId,
    });

    return this.updateWhenHasNewMessage(saveMessage, conversationId, userId);
  }

  public async addFiles(
    files: any,
    userId: string,
    type: any,
    channelId?: string,
    conversationId?: string,
  ): Promise<IMessagesResponse> {
    // validate //
    const content = await this.uploadService.uploadMultiImageToCloudinary(
      files,
      'attachments',
    );

    const tempStringFile = content.join(',,');

    const newMessageTempt: ICreateTextMessageViewReq = {
      userId,
      content: tempStringFile,
      type,
    };

    if (channelId) newMessageTempt.channelId = channelId;
    else newMessageTempt.conversationId = conversationId;

    await this.conversationRepository.resetUserDeleteConversation(
      conversationId,
    );

    const saveMessage = await this.messagesRepository.addText({
      userId: userId,
      content: newMessageTempt.content,
      type: newMessageTempt.type,
      conversationId: newMessageTempt.conversationId,
    });

    return this.updateWhenHasNewMessage(saveMessage, conversationId, userId);
  }

  public async updateWhenHasNewMessage(
    saveMessage: Message,
    conversationId: string,
    userId: string,
  ): Promise<IMessagesResponse> {
    const { _id, channelId } = saveMessage;

    if (channelId) {
      // nothing //
    } else {
      // Update last messages of conversation //
      await this.conversationService.updateConversation({
        id: conversationId,
        lastMessageId: _id + '',
      });
      // Update last view in conversation for member
      await this.participantsService.updateLastViewOfConversation(
        conversationId,
        userId,
      );
    }
    const { type } = await this.conversationService.findOne(conversationId);
    return await this.getById(_id, type);
  }

  public async deleteById(
    _id: string,
    senderId: string,
  ): Promise<IDeleteMessageRes> {
    // validate //
    const message = await this.messagesRepository.getById(_id);
    const { userId, conversationId, channelId } = message;

    if (userId != senderId) throw new AppError(ERROR_CODE.PERMISSION_DENIED);

    await this.messagesRepository.deleteById(_id);

    await this.conversationRepository.resetUserDeleteConversation(
      conversationId,
    );

    return {
      _id,
      conversationId,
      channelId,
    };
  }

  public async addPinMessage(
    messId: string,
    userId: string,
  ): Promise<IResPinMessageSlot> {
    // validate //
    const message = await this.messagesRepository.getById(messId);
    const { conversationId } = message;

    const conversation = await this.conversationRepository.getByIdAndUserId(
      conversationId,
      userId,
    );

    const { _id, pinMessageIds } = conversation;

    if (pinMessageIds.includes(messId) || pinMessageIds.length >= 3)
      throw new AppError(ERROR_CODE.MAX_PIN_MESSAGE);

    await this.conversationRepository.addPinMessage(_id, messId);

    const newMessage = await this.messagesRepository.addText({
      userId: userId,
      content: 'PIN_MESSAGE',
      type: typeMessage.NOTIFY,
      conversationId: _id,
    });

    return {
      conversationId: _id,
      message: await this.updateWhenHasNewMessage(newMessage, _id, userId),
    };
  }

  public async getAllPinMessages(
    converId: string,
    userId: string,
  ): Promise<IMessagesResponse[]> {
    // validate //

    const conversation = await this.conversationRepository.getByIdAndUserId(
      converId,
      userId,
    );
    const { type, pinMessageIds } = conversation;

    const pinMessagesResult: IMessagesResponse[] = [];
    await Promise.all(
      pinMessageIds.map(async (messageId) => {
        pinMessagesResult.push(await this.getById(messageId, type));
      }),
    );

    return pinMessagesResult;
  }

  public async deletePinMessage(
    messId: string,
    userId: string,
  ): Promise<IResPinMessageSlot> {
    // validate //
    const message = await this.messagesRepository.getById(messId);
    const { conversationId } = message;

    const conversation = await this.conversationRepository.getByIdAndUserId(
      conversationId,
      userId,
    );

    const { _id } = conversation;

    await this.conversationRepository.deletePinMessage(_id, messId);

    const newMessage = await this.messagesRepository.addText({
      userId: userId,
      content: 'REMOVE_PIN_MESSAGE',
      type: typeMessage.NOTIFY,
      conversationId: _id,
    });

    return {
      conversationId: conversationId,
      message: await this.updateWhenHasNewMessage(newMessage, _id, userId),
    };
  }
}
