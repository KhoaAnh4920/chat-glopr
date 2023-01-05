import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppError, ERROR_CODE } from 'src/shared/error';
import { FriendDocument } from 'src/_schemas/friend.schema';
import { FriendRequestDocument } from 'src/_schemas/friendRequest.schema';
import {
  FriendModel,
  FriendRequestModel,
  IDeleteFriendRequestViewReq,
} from './friend.type';
const ObjectId = require('mongoose').Types.ObjectId;

export class FriendRepository {
  constructor(
    @InjectModel('Friend')
    private friendModel: Model<FriendDocument>,

    @InjectModel('FriendRequest')
    private friendRequestModel: Model<FriendRequestDocument>,
  ) {}

  async existsByIds(userId1, userId2, type): Promise<boolean> {
    let isExists = null;
    if (type === 'FRIEND')
      isExists = await this.friendModel.findOne({
        userIds: { $all: [userId1, userId2] },
      });
    else
      isExists = await this.friendRequestModel.findOne({
        senderId: userId1,
        receiverId: userId2,
      });

    if (isExists) return true;
    return false;
  }

  async addFriends(userId1, userId2): Promise<boolean> {
    const payload = new FriendModel([userId1, userId2]);
    await this.friendModel.create(payload);
    return true;
  }

  async sendFriendInvite(userId1, userId2): Promise<boolean> {
    const payload = new FriendRequestModel(userId1, userId2);
    try {
      await this.friendRequestModel.create(payload);
      return true;
    } catch (err) {
      console.log(err);
      throw new AppError(ERROR_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteFriendRequest(
    viewReq: IDeleteFriendRequestViewReq,
  ): Promise<boolean> {
    const queryResult = await this.friendRequestModel.deleteOne({
      senderId: viewReq._id,
      receiverId: viewReq.userId,
    });

    const { deletedCount } = queryResult;
    if (deletedCount === 0) throw new AppError(ERROR_CODE.NOT_FOUND_REQUEST);

    return true;
  }

  async getListFriendRequest(_id: string): Promise<any> {
    const users = await this.friendRequestModel.aggregate([
      { $match: { senderId: ObjectId(_id) } },
      { $project: { _id: 0, receiverId: 1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'receiverId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $replaceWith: '$user' },
      {
        $project: {
          _id: 1,
          fullName: 1,
          userName: 1,
          avatar: 1,
        },
      },
    ]);
    console.log('users: ', users);
    return users;
  }
}