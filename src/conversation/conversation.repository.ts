import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppError, ERROR_CODE } from 'src/shared/error';
import {
  Conversation,
  ConversationDocument,
} from 'src/_schemas/conversation.schema';
import { ConversationModel, IConversationModel } from './consersation.type';
const ObjectId = require('mongoose').Types.ObjectId;
import { UpdateResult } from 'mongodb';

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
    skip: number,
    limit: number,
  ): Promise<ConversationDocument[]> {
    return this.conversationModel
      .find(
        {
          members: { $in: [userId] },
          deletedUserIds: {
            $nin: [userId],
          },
        },
        {
          skip: +skip,
        },
        {
          limit: +limit,
        },
      )
      .sort({ updatedAt: -1 });
  }

  public async getListIndividualByNameContainAndUserId(
    name: string,
    userId: string,
    skip: number,
    limit: number,
  ): Promise<ConversationDocument[]> {
    return this.conversationModel.aggregate([
      {
        $match: {
          members: { $in: [ObjectId(userId)] },
          type: false,
          deletedUserIds: {
            $nin: [userId],
          },
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
        $skip: +skip,
      },
      {
        $limit: +limit,
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
    skip: number,
    limit: number,
  ): Promise<ConversationDocument[]> {
    return this.conversationModel
      .find(
        {
          members: { $in: [userId] },
          type: true,
          name: { $regex: name, $options: 'i' },
          deletedUserIds: {
            $nin: [userId],
          },
        },
        {
          skip: +skip,
        },
        {
          limit: +limit,
        },
      )
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

  public async updateConversation(
    id,
    updateConversationDto,
  ): Promise<ConversationDocument> {
    return this.conversationModel
      .findByIdAndUpdate(id, updateConversationDto, { new: true })
      .exec();
  }

  public async addMemberConversation(
    id: string,
    userIds: string[],
  ): Promise<boolean> {
    await this.conversationModel.updateOne(
      { _id: id },
      { $push: { members: userIds } },
    );
    return true;
  }

  public async deleteMember(id: string, userIds: string): Promise<boolean> {
    await this.conversationModel.updateOne(
      { _id: ObjectId(id) },
      { $pull: { members: userIds } },
    );
    return true;
  }

  public async deleteConversation(
    id: string,
    userIds: string,
  ): Promise<boolean> {
    await this.conversationModel.updateOne(
      { _id: ObjectId(id) },
      { $push: { deletedUserIds: userIds } },
    );
    return true;
  }

  public async resetUserDeleteConversation(id: string): Promise<boolean> {
    await this.conversationModel.updateOne(
      { _id: ObjectId(id) },
      { deletedUserIds: [] },
    );
    return true;
  }

  public async getByIdAndUserId(
    _id: string,
    userId: string,
  ): Promise<Conversation> {
    const conversation = await this.conversationModel.findOne({
      _id,
      members: { $in: [userId] },
    });

    if (!conversation) throw new AppError(ERROR_CODE.NOT_FOUND_CONSERVATION);

    return conversation;
  }

  public async addPinMessage(
    _id: string,
    messageId: string,
  ): Promise<UpdateResult> {
    return this.conversationModel.updateOne(
      { _id },
      { $push: { pinMessageIds: messageId } },
    );
  }

  public async deletePinMessage(
    _id: string,
    messageId: string,
  ): Promise<UpdateResult> {
    return this.conversationModel.updateOne(
      { _id },
      { $pull: { pinMessageIds: messageId } },
    );
  }
}
