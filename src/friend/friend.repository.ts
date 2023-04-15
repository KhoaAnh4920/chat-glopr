import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Friend, FriendDocument } from 'src/_schemas/friend.schema';
import { FriendRequestDocument } from 'src/_schemas/friendRequest.schema';
import { AppError, ERROR_CODE } from 'src/shared/error';
import { typeRequest } from './friend.enum';
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

  public async existsByIds(
    userId1: string,
    userId2: string,
    type: typeRequest,
  ): Promise<boolean> {
    let isExists = null;

    if (type === typeRequest.FRIEND) {
      isExists = await this.friendModel.findOne({
        userIds: { $all: [userId1, userId2] },
      });
    } else {
      isExists = await this.friendRequestModel.findOne({
        senderId: userId1,
        receiverId: userId2,
      });
    }

    if (isExists) return true;
    return false;
  }

  public async addFriends(userId1: string, userId2: string): Promise<boolean> {
    const payload = new FriendModel([userId1, userId2]);
    await this.friendModel.create(payload);
    return true;
  }

  public async sendFriendInvite(
    userId1: string,
    userId2: string,
  ): Promise<boolean> {
    const payload = new FriendRequestModel(userId1, userId2);
    try {
      await this.friendRequestModel.create(payload);
      return true;
    } catch (err) {
      console.log(err);
      throw new AppError(ERROR_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteFriendRequest(
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

  public async getListInvitesWasSend(
    _id: string,
  ): Promise<FriendRequestDocument[]> {
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
    return users;
  }

  public async getListInvites(_id: string): Promise<FriendRequestDocument[]> {
    const users = await this.friendRequestModel.aggregate([
      { $match: { receiverId: ObjectId(_id) } },
      { $project: { _id: 0, senderId: 1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'senderId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $replaceWith: '$user' },
      {
        $project: {
          _id: 1,
          name: 1,
          userName: 1,
          avatar: 1,
        },
      },
    ]);
    return users;
  }

  public async getListFriends(name: string, _id: string): Promise<Friend[]> {
    const users = await this.friendModel.aggregate([
      { $project: { _id: 0, userIds: 1 } },
      {
        $match: {
          userIds: { $in: [ObjectId(_id)] },
        },
      },
      { $unwind: '$userIds' },
      {
        $match: {
          userIds: { $ne: ObjectId(_id) },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userIds',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $replaceWith: '$user' },
      {
        $match: {
          fullName: { $regex: name, $options: 'i' },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          userName: 1,
          avatar: 1,
        },
      },
    ]);
    return users;
  }
}
