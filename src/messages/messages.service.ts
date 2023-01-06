import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { ConversationService } from 'src/conversation/conversation.service';
import { ParticipantsService } from 'src/participants/participants.service';
import { MessagesRepository } from './message.repository';
const messageUtils = require('../shared/common/messageUtils');

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,
    private readonly participantsService: ParticipantsService,
  ) {}

  public async getById(_id, type) {
    if (type) {
      const message = await this.messagesRepository.getByIdOfGroup(_id);
      messageUtils;
      return messageUtils.convertMessageOfGroup(message);
    }

    const message = await this.messagesRepository.getByIdOfIndividual(_id);
    console.log('Check message: ', message);
    return messageUtils.convertMessageOfIndividual(message);
  }

  public async addText(message, userId): Promise<any> {
    // validate //

    const { channelId, conversationId } = message;

    if (channelId) delete message.conversationId;

    console.log('Check before add text: ', userId);

    const saveMessage = await this.messagesRepository.addText({
      userId,
      ...message,
    });

    return this.updateWhenHasNewMessage(saveMessage, conversationId, userId);
  }

  public async updateWhenHasNewMessage(saveMessage, conversationId, userId) {
    const { _id, channelId } = saveMessage;

    if (channelId) {
      // nothing //
    } else {
      // Update last messages of conversation //
      await this.conversationService.updateConversation({
        id: conversationId,
        lastMessageId: _id,
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
}
