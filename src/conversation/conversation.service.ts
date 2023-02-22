import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ConversationRepository } from './conversation.repository';
import { Document, ObjectId, SchemaTypes, Types } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import {
  IConversationModel,
  ICreateIndividual,
  ISummaryConversation,
  IUpdateConversationViewReq,
  IValidateIndividual,
  ResConverObjLayout,
  UpdateConversationModel,
} from './consersation.type';
import { ParticipantsRepository } from 'src/participants/participants.repository';
import { AppError, ERROR_CODE } from 'src/shared/error';
import { MessagesService } from 'src/messages/messages.service';
import { MessagesRepository } from 'src/messages/message.repository';
import { FriendService } from 'src/friend/friend.service';
import { DateUtils } from 'src/shared/common/dateUtils';
import { typeMessage } from 'src/messages/messages.enum';
import {
  ICreateTextMessageViewReq,
  IMessagesResponse,
} from 'src/messages/messages.type';
import { UsersRepository } from 'src/users/users.repository';
import { CacheRepository } from 'src/shared/cache/cache.repository';
import { ConversationDocument } from 'src/_schemas/conversation.schema';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly participantsRepository: ParticipantsRepository,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => MessagesService))
    private readonly messagesService: MessagesService,
    private readonly messagesRepository: MessagesRepository,
    @Inject(forwardRef(() => FriendService))
    private readonly friendService: FriendService,
    private readonly usersRepository: UsersRepository,
    private readonly cacheRepository: CacheRepository,
  ) {}

  public async findOne(
    indentity: Types.ObjectId | string,
  ): Promise<IConversationModel> {
    return this.conversationRepository.findOne(indentity);
  }

  public async createIndividualConversationWhenWasFriend(
    userId1: string,
    userId2: string,
  ) {
    const { _id, isExists } = await this.createIndividualConversation(
      userId1,
      userId2,
    );

    // Create notify message
    const newMessage: ICreateTextMessageViewReq = {
      content: 'Đã là bạn bè',
      type: typeMessage.NOTIFY,
      conversationId: _id,
    };

    const saveMessage = await this.messagesService.addText(newMessage, userId1);

    return { conversationId: _id, isExists, message: saveMessage };
  }

  public async createIndividualConversation(
    userId1: string,
    userId2: string,
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

  public async createGroupConversation(
    creatorId: string,
    name: string,
    userIds: string[],
  ): Promise<string> {
    if (userIds.length <= 0) throw new AppError(ERROR_CODE.USER_IDS_INVALID);

    // Check user is exists //
    const userIdsTempt = [creatorId, ...userIds];
    await this.usersRepository.checkByIds(userIdsTempt);

    // Create new conversation
    const { _id } = await this.conversationRepository.createConvesation(
      userIdsTempt,
      true,
      name,
      creatorId,
    );

    const newMessage: ICreateTextMessageViewReq = {
      content: 'Đã tạo nhóm',
      type: typeMessage.NOTIFY,
      conversationId: _id,
    };

    await this.messagesRepository.addText({
      userId: creatorId,
      ...newMessage,
    });

    // lưu danh sách user
    await Promise.all(
      userIdsTempt.map(async (userId) => {
        await this.participantsRepository.createParticipants(_id, userId, '');
      }),
    );

    const memberAddMessage: ICreateTextMessageViewReq = {
      manipulatedUserIds: [...userIds],
      content: 'Đã thêm vào nhóm',
      type: typeMessage.NOTIFY,
      conversationId: _id,
    };
    const messRes = await this.messagesRepository.addText({
      userId: creatorId,
      ...memberAddMessage,
    });
    await this.conversationRepository.updateConversation(_id, {
      lastMessageId: messRes._id,
    });
    return _id;
  }

  public async checkIndividualConversation(
    userId1: string,
    userId2: string,
  ): Promise<string | undefined> {
    const conversation =
      await this.conversationRepository.existsIndividualConversation(
        userId1,
        userId2,
      );
    if (conversation) return conversation._id;
    return null;
  }

  public async validateIndividualConversation(
    userId1: string,
    userId2: string,
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
      throw new AppError(ERROR_CODE.NOT_FOUND_CONSERVATION);
    }

    const payload = new UpdateConversationModel(
      conver._id,
      viewReq.name || conver.name,
      viewReq.image || conver.image,
      viewReq.creatorid || conver.creatorId,
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

  public async getList(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<ISummaryConversation[]> {
    const skip = (page - 1) * pageSize;
    const conversations = await this.conversationRepository.getListByUserId(
      userId,
      skip,
      pageSize,
    );
    // const conversationIds = conversations.map(
    //   (conversationEle) => conversationEle._id,
    // );
    // return this.getListSummaryByIds(conversationIds, userId);
    return this.getListSummaryByIds(conversations, userId);
  }

  public async getListIndividual(
    name: string,
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<ISummaryConversation[]> {
    const skip = (page - 1) * pageSize;
    const conversations =
      await this.conversationRepository.getListIndividualByNameContainAndUserId(
        name,
        userId,
        skip,
        pageSize,
      );
    // const conversationIds = conversations.map(
    //   (conversationEle) => conversationEle._id,
    // );
    return this.getListSummaryByIds(conversations, userId);
  }

  public async getListGroup(
    name: string,
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<ISummaryConversation[]> {
    const skip = (page - 1) * pageSize;
    const conversations =
      await this.conversationRepository.getListGroupByNameContainAndUserId(
        name,
        userId,
        skip,
        pageSize,
      );
    // const conversationIds = conversations.map(
    //   (conversationEle) => conversationEle._id,
    // );
    return this.getListSummaryByIds(conversations, userId);
  }

  public async getListSummaryByIds(
    conversations: ConversationDocument[],
    userId: string,
  ): Promise<ISummaryConversation[]> {
    const conversationsResult = [];
    for (const conver of conversations) {
      const conversation = await this.getSummaryByIdAndUserId(conver, userId);
      conversationsResult.push(conversation);
    }

    return conversationsResult;
  }

  // get thông tin tóm tắt của 1 cuộc hộp thoại.
  public async getSummaryByIdAndUserId(
    conver: ConversationDocument | IConversationModel,
    userId: string,
  ): Promise<ISummaryConversation> {
    const member =
      await this.participantsRepository.getByConversationIdAndUserId(
        conver._id,
        userId,
      );
    const { lastView, isNotify } = member;
    // const conversation = await this.conversationRepository.findOne(_id);
    const { lastMessageId, type, members, isJoinFromLink } = conver;
    const lastMessage = lastMessageId
      ? await this.messagesService.getById(lastMessageId, type)
      : null;
    const numberUnread = await this.messagesRepository.countUnread(
      lastView,
      conver._id,
    );
    let nameAndAvatarInfo;
    if (type) nameAndAvatarInfo = await this.getGroupConversation(conver);
    else {
      nameAndAvatarInfo =
        await this.participantsRepository.getIndividualConversation(
          conver._id,
          userId,
        );

      const { members } = conver;
      const index = members.findIndex((ele) => ele + '' != userId);
      nameAndAvatarInfo.userId = members[index];
      nameAndAvatarInfo.friendStatus = await this.friendService.getFriendStatus(
        userId,
        members[index],
      );
      const cachedUser = await this.cacheRepository.getUserInCache(
        members[index],
      );
      if (cachedUser) {
        nameAndAvatarInfo.isOnline = cachedUser.isOnline;
        nameAndAvatarInfo.lastLogin = cachedUser.lastLogin;
      } else {
        nameAndAvatarInfo.isOnline = false;
        nameAndAvatarInfo.lastLogin = null;
      }
    }

    let lastMessageTempt = {};

    const numberOfDeletedMessages =
      await this.messagesRepository.numberOfDeletedMessages(conver._id, userId);
    if (!lastMessage || numberOfDeletedMessages === 0) lastMessageTempt = null;
    else {
      lastMessageTempt = {
        ...lastMessage,
        createdAt: lastMessage.createdAt,
        //createdAt: DateUtils.formatAMPM(lastMessage.createdAt),
      };
    }

    return {
      _id: conver._id,
      ...nameAndAvatarInfo,
      type,
      totalMembers: members.length,
      numberUnread,
      lastMessage: lastMessageTempt,
      isNotify,
      isJoinFromLink,
    };
  }

  public async getGroupConversation(
    conversation: IConversationModel,
  ): Promise<ResConverObjLayout> {
    const { _id, name, image } = conversation;

    let groupName = '';
    const groupAvatar = [];
    if (!name || !image) {
      const nameAndAvataresOfGroup =
        await this.conversationRepository.getListNameAndAvatarOfMembersById(
          _id,
        );

      for (const tempt of nameAndAvataresOfGroup) {
        const nameTempt = tempt.name;
        const { avatar } = tempt;

        groupName += `, ${nameTempt}`;
        groupAvatar.push({ avatar });
      }
    }

    const result: ResConverObjLayout = {
      name,
      image,
    };
    if (!name) result.name = groupName.slice(2);
    if (!image) result.image = groupAvatar;

    return result;
  }

  public async addMemberToConversation(
    userId: string,
    converId: string,
    userIds: string[],
  ): Promise<IMessagesResponse> {
    // add member trong conversation

    await this.conversationRepository.addMemberConversation(converId, userIds);
    // lưu danh sách user
    await Promise.all(
      userIds.map(async (userId) => {
        await this.participantsRepository.createParticipants(
          converId,
          userId,
          '',
        );
      }),
    );
    const memberAddMessage: ICreateTextMessageViewReq = {
      manipulatedUserIds: [...userIds],
      content: 'Đã thêm vào nhóm',
      type: typeMessage.NOTIFY,
      conversationId: converId,
    };
    const messRes = await this.messagesRepository.addText({
      userId: userId,
      ...memberAddMessage,
    });
    const payload: UpdateConversationModel = {
      id: converId,
      lastMessageId: messRes._id + '',
    };

    await this.conversationRepository.updateConversation(payload.id, payload);

    await this.participantsRepository.updateLastViewOfConversation(
      converId,
      userId,
    );

    return this.messagesService.getById(messRes._id + '', true);
  }

  public async deleteMember(
    userId: string,
    converId: string,
    deleteUserId: string,
  ): Promise<IMessagesResponse> {
    // delete member trong conversation
    await this.conversationRepository.deleteMember(converId, deleteUserId);
    await this.participantsRepository.deleteMember(converId, deleteUserId);

    const memberDeleteMessage: ICreateTextMessageViewReq = {
      manipulatedUserIds: [deleteUserId],
      content: 'Đã xóa ra khỏi nhóm',
      type: typeMessage.NOTIFY,
      conversationId: converId,
    };
    const messRes = await this.messagesRepository.addText({
      userId: userId,
      ...memberDeleteMessage,
    });
    const payload: UpdateConversationModel = {
      id: converId,
      lastMessageId: messRes._id + '',
    };

    await this.conversationRepository.updateConversation(payload.id, payload);

    await this.participantsRepository.updateLastViewOfConversation(
      converId,
      userId,
    );
    return this.messagesService.getById(messRes._id + '', true);
  }

  public async leaveGroup(
    converId: string,
    userId: string,
  ): Promise<IMessagesResponse> {
    // delete member trong conversation
    await this.conversationRepository.deleteMember(converId, userId);
    await this.participantsRepository.deleteMember(converId, userId);

    const memberDeleteMessage: ICreateTextMessageViewReq = {
      content: 'Đã rời khỏi nhóm',
      type: typeMessage.NOTIFY,
      conversationId: converId,
    };
    const messRes = await this.messagesRepository.addText({
      userId: userId,
      ...memberDeleteMessage,
    });
    const payload: UpdateConversationModel = {
      id: converId,
      lastMessageId: messRes._id + '',
    };

    await this.conversationRepository.updateConversation(payload.id, payload);

    return this.messagesService.getById(messRes._id + '', true);
  }

  public async deleteConversation(
    converId: string,
    userId: string,
  ): Promise<boolean> {
    // delete trong conversation
    await this.conversationRepository.deleteConversation(converId, userId);
    // delete message //
    await this.messagesRepository.deleteAll(converId, userId);
    return true;
  }
}
