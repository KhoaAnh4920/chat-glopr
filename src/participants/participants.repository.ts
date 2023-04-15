import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { IUserNickNameRes } from 'src/conversation/consersation.type';
import { AppError, ERROR_CODE } from 'src/shared/error';
import {
  Participants,
  ParticipantsDocument,
} from 'src/_schemas/participants.schema';
import { ParticipantsModel } from './paticipants.type';
const ObjectId = require('mongoose').Types.ObjectId;

export class ParticipantsRepository {
  constructor(
    @InjectModel('Participants')
    private participantsModel: Model<ParticipantsDocument>,
  ) {}

  public async createParticipants(
    conversationId: ObjectId,
    userId: ObjectId,
    name: string,
  ): Promise<Participants> {
    const payload = new ParticipantsModel(conversationId, userId, name);
    return await this.participantsModel.create(payload);
  }

  public async updateLastViewOfConversation(
    conversationId: string,
    userId: string,
  ) {
    return this.participantsModel.updateOne(
      { conversationId, userId },
      { $set: { lastView: new Date() } },
    );
  }

  public async getByConversationIdAndUserId(
    conversationId: string,
    userId: string,
  ) {
    const member = await this.participantsModel.findOne({
      conversationId,
      userId,
    });

    if (!member) throw new AppError(ERROR_CODE.NOT_FOUND_CONSERVATION);

    return member;
  }

  public async getIndividualConversation(
    _id: string,
    userId: string,
  ): Promise<ParticipantsDocument> {
    const datas = await this.participantsModel.aggregate([
      {
        $match: {
          conversationId: ObjectId(_id),
          userId: { $ne: ObjectId(userId) },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 0,
          name: '$user.fullName',
          avatar: '$user.avatar',
        },
      },
    ]);

    return datas[0];
  }

  public async getListInfosByConversationId(
    conversationId: string,
  ): Promise<ParticipantsDocument[]> {
    const data = await this.participantsModel.aggregate([
      {
        $match: {
          conversationId: ObjectId(conversationId),
        },
      },
      {
        $project: {
          // name: 1,
          userId: 1,
          nickName: '$name',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 0,
          nickName: 1,
          user: {
            _id: 1,
            fullName: 1,
            userName: 1,
            avatar: 1,
          },
        },
      },
      {
        $replaceWith: {
          $mergeObjects: [
            {
              _id: 1,
              nickName: '$nickName',
              fullName: 1,
              userName: 1,
              avatar: 1,
            },
            '$user',
          ],
        },
      },
    ]);
    return data;
  }

  public async getMemberOfConversation(
    conversationId: string,
    userId: string,
  ): Promise<IUserNickNameRes> {
    const data = await this.participantsModel.aggregate([
      {
        $match: {
          conversationId: ObjectId(conversationId),
          userId: ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: userId,
          nickName: '$name',
          fullName: '$user.fullName',
          avatar: '$user.avatar',
        },
      },
    ]);
    return data[0];
  }

  public async deleteMember(
    converId: string,
    userId: string,
  ): Promise<boolean> {
    await this.participantsModel.deleteOne({
      conversationId: converId,
      userId: userId,
    });
    return true;
  }
}
