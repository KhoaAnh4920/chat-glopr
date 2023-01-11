import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppError, ERROR_CODE } from 'src/shared/error';
import {
  Conversation,
  ConversationDocument,
} from 'src/_schemas/conversation.schema';
import { ConversationModel, IConversationModel } from './consersation.type';
const ObjectId = require('mongoose').Types.ObjectId;

export class ConversationRepository {
  constructor(
    @InjectModel('Conversation')
    private conversationModel: Model<ConversationDocument>,
  ) {}

  public async findOne(indentity): Promise<IConversationModel | undefined> {
    return this.conversationModel.findOne({
      _id: indentity,
    });
  }

  public async getListNameAndAvatarOfMembersById(userId: string): Promise<any> {
    return this.conversationModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },

      {
        $project: {
          _id: 0,
          members: 1,
        },
      },
      {
        $unwind: '$members',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'members',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          name: '$user.fullName',
          avatar: '$user.avatar',
        },
      },
    ]);
  }

  public async getListByUserId(
    userId: string,
  ): Promise<ConversationDocument[]> {
    return this.conversationModel
      .find({
        members: { $in: [userId] },
      })
      .sort({ updatedAt: -1 });
  }

  public async getListIndividualByNameContainAndUserId(
    name: string,
    userId: string,
  ): Promise<ConversationDocument[]> {
    return this.conversationModel.aggregate([
      {
        $match: {
          members: { $in: [ObjectId(userId)] },
          type: false,
        },
      },
      {
        $lookup: {
          from: 'participants',
          localField: '_id',
          foreignField: 'conversationId',
          as: 'users',
        },
      },
      {
        $unwind: '$users',
      },
      {
        $match: {
          'users.userId': { $ne: ObjectId(userId) },
          'users.name': { $regex: name, $options: 'i' },
        },
      },
      {
        $sort: { updatedAt: -1 },
      },
      {
        $project: { _id: 1 },
      },
    ]);
  }

  public async getListGroupByNameContainAndUserId(
    name: string,
    userId: string,
  ): Promise<ConversationDocument[]> {
    return this.conversationModel
      .find({
        members: { $in: [userId] },
        type: true,
        name: { $regex: name, $options: 'i' },
      })
      .sort({ updatedAt: -1 });
  }

  public async existsIndividualConversation(
    userId1: string,
    userId2: string,
  ): Promise<Conversation | undefined> {
    return this.conversationModel.findOne({
      type: false,
      members: { $all: [userId1, userId2] },
    });
  }

  public async createConvesation(
    members: string[],
    type: boolean,
    name?: string,
    creatorId?: string,
  ): Promise<Conversation> {
    const payload = new ConversationModel(members, type, name, '', creatorId);
    return await this.conversationModel.create(payload);
  }

  async updateConversation(
    id,
    updateConversationDto,
  ): Promise<ConversationDocument> {
    return this.conversationModel
      .findByIdAndUpdate(id, updateConversationDto, { new: true })
      .exec();
  }
}
