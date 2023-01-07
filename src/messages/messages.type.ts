import { ObjectId, Types } from 'mongoose';

export interface IMessagesModel {
  readonly userId: ObjectId;
  readonly content: string;
  readonly tags?: ObjectId[];
  readonly replyMessageId?: ObjectId;
  readonly manipulatedUserIds?: ObjectId[];
  readonly type: string;
  readonly reacts?: {
    userId: ObjectId;
    typeReaction: number;
  }[];
  readonly options?: {
    userIds: ObjectId[];
    name: string;
  }[];
  readonly deletedUserIds?: ObjectId[];
  readonly conversationId?: ObjectId;
  readonly channelId?: ObjectId;
}

export class MessagesModel implements IMessagesModel {
  constructor(
    readonly userId: ObjectId,
    readonly content: string,
    readonly type: string,
    readonly conversationId?: ObjectId,
    readonly channelId?: ObjectId,
    readonly tags?: ObjectId[],
    readonly replyMessageId?: ObjectId,
    readonly manipulatedUserIds?: ObjectId[],
    readonly reacts?: {
      userId: ObjectId;
      typeReaction: number;
    }[],
    readonly options?: {
      userIds: ObjectId[];
      name: string;
    }[],
    readonly deletedUserIds?: ObjectId[],
  ) {}
}
