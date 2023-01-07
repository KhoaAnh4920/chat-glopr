import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessagingGateway } from 'src/gateway/gateway';
import { CacheRepository } from 'src/shared/cache/cache.repository';
import { AppError, ERROR_CODE } from 'src/shared/error';
import { UsersService } from 'src/users/users.service';
import { FriendRequestDocument } from 'src/_schemas/friendRequest.schema';
import { typeRequest } from './friend.enum';
import { FriendRepository } from './friend.repository';
import { IDeleteFriendRequestViewReq, IFriendList } from './friend.type';

@Injectable()
export class FriendService {
  constructor(
    private readonly friendRepository: FriendRepository,
    private readonly usersService: UsersService,
    private readonly messagingGateway: MessagingGateway,
    private readonly conversationService: ConversationService,
    private readonly cacheRepository: CacheRepository,
  ) {}

  async sendFriendInvite(_id: string, userId: string): Promise<boolean> {
    const receiverUser = await this.usersService.findOne(userId);
    const { userName, avatar } = await this.usersService.findOne(_id);
    if (!receiverUser) throw new AppError(ERROR_CODE.USER_NOT_FOUND);

    // check có bạn bè hay chưa
    if (await this.existsByIds(_id, userId, typeRequest.FRIEND))
      throw new AppError(ERROR_CODE.FRIEND_EXISTS);

    // check đã gửi lời mời kết bạn
    if (
      (await this.existsByIds(_id, userId, typeRequest.FRIEND_REQUEST)) ||
      (await this.existsByIds(userId, _id, typeRequest.FRIEND_REQUEST))
    )
      throw new AppError(ERROR_CODE.INVITE_EXISTS);

    const res = await this.friendRepository.sendFriendInvite(_id, userId);
    if (res) {
      this.messagingGateway.server
        .to(userId + '')
        .emit('send-friend-invite', { _id, userName, avatar });
    }
    return res;
  }

  async existsByIds(
    userId1: string,
    userId2: string,
    type: typeRequest,
  ): Promise<boolean> {
    return this.friendRepository.existsByIds(userId1, userId2, type);
  }

  async deleteFriendRequest(
    viewReq: IDeleteFriendRequestViewReq,
  ): Promise<boolean> {
    const receiverUser = await this.usersService.findOne(viewReq.userId);
    if (!receiverUser) throw new AppError(ERROR_CODE.USER_NOT_FOUND);
    const res = await this.friendRepository.deleteFriendRequest(viewReq);
    if (res) {
      this.messagingGateway.server
        .to(viewReq.userId + '')
        .emit('deleted-invite-was-send', viewReq._id);
    }
    return res;
  }

  async getListInvitesWasSend(
    userId: string,
  ): Promise<FriendRequestDocument[]> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new AppError(ERROR_CODE.USER_NOT_FOUND);
    return this.friendRepository.getListInvitesWasSend(userId);
  }

  async getListInvites(userId: string): Promise<FriendRequestDocument[]> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new AppError(ERROR_CODE.USER_NOT_FOUND);
    return this.friendRepository.getListInvites(userId);
  }
  async getListFriends(name: string, userId: string): Promise<IFriendList[]> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new AppError(ERROR_CODE.USER_NOT_FOUND);
    const friends = await this.friendRepository.getListFriends(name, userId);
    const friendsTempt = await Promise.all(
      friends.map(async (item) => {
        const obj = <any>{ ...item };
        const cachedUser = await this.cacheRepository.getUserInCache(item._id);
        if (cachedUser) {
          obj.isOnline = cachedUser.isOnline;
          obj.lastLogin = cachedUser.lastLogin;
        }
        return obj;
      }),
    );
    return friendsTempt;
  }

  async acceptFriendRequest(_id: string, userId: string): Promise<any> {
    // check có lời mời này không
    if (!(await this.existsByIds(userId, _id, typeRequest.FRIEND_REQUEST)))
      throw new AppError(ERROR_CODE.NOT_FOUND_REQUEST);
    // check đã là bạn bè
    if (await this.existsByIds(_id, userId, typeRequest.FRIEND))
      throw new AppError(ERROR_CODE.FRIEND_EXISTS);

    // xóa lời mời
    await this.friendRepository.deleteFriendRequest({
      _id,
      userId,
    });
    // Add friend
    await this.friendRepository.addFriends(_id, userId);

    // tạo conversation //
    const result =
      await this.conversationService.createIndividualConversationWhenWasFriend(
        _id,
        userId,
      );

    // Fire socket //
    // const { conversationId, isExists, message } = result;
    // const { name, avatar } = await this.cacheRepository.getUserInCache(_id);
    // this.messagingGateway.server
    //   .to(userId + '')
    //   .emit('accept-friend', { _id, name, avatar });
    // if (isExists)
    //   this.messagingGateway.server
    //     .to(conversationId + '')
    //     .emit('new-message', conversationId, message);
    // else {
    //   this.messagingGateway.server
    //     .to(_id + '')
    //     .emit('create-individual-conversation-when-was-friend', conversationId);
    //   this.messagingGateway.server
    //     .to(userId + '')
    //     .emit('create-individual-conversation-when-was-friend', conversationId);
    // }
    return result;
  }
}
