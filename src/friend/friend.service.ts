import { Injectable } from '@nestjs/common';
import { MessagingGateway } from 'src/gateway/gateway';
import { AppError, ERROR_CODE } from 'src/shared/error';
import { UsersService } from 'src/users/users.service';
import { typeRequest } from './friend.enum';
import { FriendRepository } from './friend.repository';
import { IDeleteFriendRequestViewReq } from './friend.type';

@Injectable()
export class FriendService {
  constructor(
    private readonly friendRepository: FriendRepository,
    private readonly usersService: UsersService,
    private readonly messagingGateway: MessagingGateway,
  ) {}

  async sendFriendInvite(_id, userId): Promise<boolean> {
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

  async existsByIds(userId1, userId2, type): Promise<boolean> {
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

  async getListFriendRequest(userId: string): Promise<any> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new AppError(ERROR_CODE.USER_NOT_FOUND);
    return this.friendRepository.getListFriendRequest(userId);
  }
}
