import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ConversationRepository } from './conversation.repository';
import { Document, ObjectId, SchemaTypes, Types } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import {
  IConversationModel,
  ICreateIndividual,
  IUpdateConversationViewReq,
  IValidateIndividual,
  UpdateConversationModel,
} from './consersation.type';
import { ParticipantsRepository } from 'src/participants/participants.repository';
import { AppError, ERROR_CODE } from 'src/shared/error';
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly participantsRepository: ParticipantsRepository,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => MessagesService))
    private readonly messagesService: MessagesService,
  ) {}

  async findOne(indentity): Promise<IConversationModel> {
    return this.conversationRepository.findOne(indentity);
  }

  public async createIndividualConversationWhenWasFriend(
    userId1: ObjectId,
    userId2: ObjectId,
  ) {
    const { _id, isExists } = await this.createIndividualConversation(
      userId1,
      userId2,
    );

    // Create notify message
    const newMessage = {
      content: 'Đã là bạn bè',
      type: 'NOTIFY',
      conversationId: _id,
    };

    const saveMessage = await this.messagesService.addText(newMessage, userId1);

    return { conversationId: _id, isExists, message: saveMessage };
  }

  public async createIndividualConversation(
    userId1: ObjectId,
    userId2: ObjectId,
  ): Promise<ICreateIndividual> {
    const { userName1, userName2, conversationId } =
      await this.validateIndividualConversation(userId1, userId2);
    if (conversationId) return { _id: conversationId, isExists: true };

    // Create new conversation //
    const { _id } = await this.conversationRepository.createConvesation(
      [userId1, userId2],
      false,
    );
    // Create 2 participants //
    await this.participantsRepository.createParticipants(
      _id,
      userId1,
      userName1,
    );
    await this.participantsRepository.createParticipants(
      _id,
      userId2,
      userName2,
    );
    return { _id, isExists: false };
  }

  public async checkIndividualConversation(
    userId1: ObjectId,
    userId2: ObjectId,
  ): Promise<Types.ObjectId | undefined> {
    const conversation =
      await this.conversationRepository.existsIndividualConversation(
        userId1,
        userId2,
      );
    if (conversation) return conversation._id;
    return null;
  }

  public async validateIndividualConversation(
    userId1: ObjectId,
    userId2: ObjectId,
  ): Promise<IValidateIndividual> {
    const conversationId = await this.checkIndividualConversation(
      userId1,
      userId2,
    );
    if (conversationId) return { conversationId };
    const user1 = await this.usersService.findOne(userId1);
    const user2 = await this.usersService.findOne(userId2);

    return {
      userName1: user1.fullName,
      userName2: user2.fullName,
    };
  }

  public async updateConversation(
    viewReq: IUpdateConversationViewReq,
  ): Promise<IConversationModel> {
    const conver = await this.findOne(viewReq.id);
    if (!conver) {
      throw new AppError(ERROR_CODE.USER_NOT_FOUND);
    }

    const payload = new UpdateConversationModel(
      conver._id,
      viewReq.name || conver.name,
      viewReq.image || conver.image,
      viewReq.creatorid || conver.creatorid,
      viewReq.lastMessageId || conver.lastMessageId,
      viewReq.pinMessageIds || conver.pinMessageIds,
      viewReq.members || conver.members,
      viewReq.type || conver.type,
      viewReq.isJoinFromLink || conver.isJoinFromLink,
    );

    const updateConversation =
      await this.conversationRepository.updateConversation(payload.id, payload);
    return updateConversation as IConversationModel;
  }
}
