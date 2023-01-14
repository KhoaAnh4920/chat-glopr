import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppError, ERROR_CODE } from 'src/shared/error';
import { Message, MessageDocument } from 'src/_schemas/message.schema';
import { IMessagesModel, MessagesModel } from './messages.type';
const ObjectId = require('mongoose').Types.ObjectId;

export class MessagesRepository {
  constructor(
    @InjectModel('Message')
    private messageModel: Model<MessageDocument>,
  ) {}

  public async addText(payload: IMessagesModel): Promise<Message> {
    const dataMessages: MessagesModel = {
      userId: payload.userId,
      content: payload.content,
      type: payload.type,
      conversationId: payload.conversationId,
      manipulatedUserIds: payload.manipulatedUserIds || [],
    };
    return await this.messageModel.create(dataMessages);
  }

  public async getByIdOfIndividual(_id): Promise<Message> {
    const messages = await this.messageModel.aggregate([
      {
        $match: {
          _id: ObjectId(_id),
        },
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'replyMessageId',
          foreignField: '_id',
          as: 'replyMessage',
        },
      },
      {
        $lookup: {
          from: 'participants',
          localField: 'conversationId',
          foreignField: 'conversationId',
          as: 'participants',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'participants.userId',
          foreignField: '_id',
          as: 'userInfos',
        },
      },
      {
        $project: {
          userId: 1,
          participants: {
            userId: 1,
            fullName: 1,
          },
          userInfos: {
            _id: 1,
            fullName: 1,
            avatar: 1,
          },
          content: 1,
          type: 1,
          replyMessage: {
            _id: 1,
            content: 1,
            type: 1,
            isDeleted: 1,
            userId: 1,
          },
          // reacts: {
          //   userId: 1,
          //   type: 1,
          // },
          isDeleted: 1,
          createdAt: 1,
          conversationId: 1,
        },
      },
    ]);

    if (messages.length > 0) return messages[0];

    throw new AppError(ERROR_CODE.NOT_FOUND_MESSAGE);
  }

  public async getByIdOfGroup(_id): Promise<Message> {
    const messages = await this.messageModel.aggregate([
      {
        $match: {
          _id: ObjectId(_id),
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
        $lookup: {
          from: 'users',
          localField: 'manipulatedUserIds',
          foreignField: '_id',
          as: 'manipulatedUsers',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'options.userIds',
          foreignField: '_id',
          as: 'userOptions',
        },
      },
      // replyMessage
      {
        $lookup: {
          from: 'messages',
          localField: 'replyMessageId',
          foreignField: '_id',
          as: 'replyMessage',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'replyMessage.userId',
          foreignField: '_id',
          as: 'replyUser',
        },
      },
      // lấy danh sách user thả react
      {
        $lookup: {
          from: 'users',
          localField: 'reacts.userId',
          foreignField: '_id',
          as: 'reactUsers',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'tags',
          foreignField: '_id',
          as: 'tagUsers',
        },
      },

      {
        $project: {
          user: {
            _id: 1,
            fullName: 1,
            avatar: 1,
          },
          manipulatedUsers: {
            _id: 1,
            fullName: 1,
            avatar: 1,
          },
          userOptions: {
            _id: 1,
            fullName: 1,
            avatar: 1,
          },
          options: 1,
          content: 1,
          type: 1,
          replyMessage: {
            _id: 1,
            content: 1,
            type: 1,
            isDeleted: 1,
          },
          replyUser: {
            _id: 1,
            fullName: 1,
            avatar: 1,
          },
          tagUsers: {
            _id: 1,
            fullName: 1,
          },
          reacts: 1,
          reactUsers: {
            _id: 1,
            fullName: 1,
            avatar: 1,
          },
          isDeleted: 1,
          createdAt: 1,
          conversationId: 1,
          channelId: 1,
        },
      },
    ]);

    if (messages.length > 0) return messages[0];
    throw new AppError(ERROR_CODE.NOT_FOUND_MESSAGE);
  }

  public async countUnread(time: Date, conversationId: string) {
    return await this.messageModel.countDocuments({
      createdAt: { $gt: time },
      conversationId,
    });
  }

  public async numberOfDeletedMessages(_id: string, userId: string) {
    return await this.messageModel.countDocuments({
      conversationId: _id,
      deletedUserIds: { $nin: [userId] },
    });
  }

  public async deleteAll(conversationId: string, userId: string) {
    return await this.messageModel.updateMany(
      { conversationId, deletedUserIds: { $nin: [userId] } },
      { $push: { deletedUserIds: userId } },
    );
  }

  public async getListByConversationIdAndUserIdOfGroup(
    conversationId: string,
    userId: string,
    skip: number,
    limit: number,
  ) {
    return await this.messageModel.aggregate([
      {
        $match: {
          conversationId: ObjectId(conversationId),
          deletedUserIds: {
            $nin: [ObjectId(userId)],
          },
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
        $lookup: {
          from: 'users',
          localField: 'manipulatedUserIds',
          foreignField: '_id',
          as: 'manipulatedUsers',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'options.userIds',
          foreignField: '_id',
          as: 'userOptions',
        },
      },
      // replyMessage
      {
        $lookup: {
          from: 'messages',
          localField: 'replyMessageId',
          foreignField: '_id',
          as: 'replyMessage',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'replyMessage.userId',
          foreignField: '_id',
          as: 'replyUser',
        },
      },
      // lấy danh sách user thả react
      {
        $lookup: {
          from: 'users',
          localField: 'reacts.userId',
          foreignField: '_id',
          as: 'reactUsers',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'tags',
          foreignField: '_id',
          as: 'tagUsers',
        },
      },

      {
        $project: {
          user: {
            _id: 1,
            fullName: 1,
            avatar: 1,
          },
          manipulatedUsers: {
            _id: 1,
            fullName: 1,
            avatar: 1,
          },
          userOptions: {
            _id: 1,
            fullName: 1,
            avatar: 1,
          },
          options: 1,
          content: 1,
          type: 1,
          replyMessage: {
            _id: 1,
            content: 1,
            type: 1,
            isDeleted: 1,
          },
          replyUser: {
            _id: 1,
            fullName: 1,
            avatar: 1,
          },

          tagUsers: {
            _id: 1,
            fullName: 1,
          },
          reacts: 1,
          reactUsers: {
            _id: 1,
            fullName: 1,
            avatar: 1,
          },
          isDeleted: 1,
          createdAt: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ]);
  }

  public async getListByConversationIdAndUserIdOfIndividual(
    conversationId: string,
    userId: string,
    skip: number,
    limit: number,
  ) {
    return await this.messageModel.aggregate([
      {
        $match: {
          conversationId: ObjectId(conversationId),
          deletedUserIds: {
            $nin: [ObjectId(userId)],
          },
        },
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'replyMessageId',
          foreignField: '_id',
          as: 'replyMessage',
        },
      },
      {
        $lookup: {
          from: 'participants',
          localField: 'conversationId',
          foreignField: 'conversationId',
          as: 'participants',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'members.userId',
          foreignField: '_id',
          as: 'userInfos',
        },
      },
      {
        $project: {
          userId: 1,
          participants: {
            userId: 1,
            fullName: 1,
          },
          userInfos: {
            _id: 1,
            fullName: 1,
            avatar: 1,
          },
          content: 1,
          type: 1,
          replyMessage: {
            _id: 1,
            content: 1,
            type: 1,
            isDeleted: 1,
            userId: 1,
          },
          reacts: {
            userId: 1,
            type: 1,
          },
          isDeleted: 1,
          createdAt: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ]);
  }
}
