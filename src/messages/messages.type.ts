import { ObjectId, Types } from 'mongoose';
import { typeMessage } from './messages.enum';

export interface IMessagesResponse {
  readonly _id: string;
  readonly content: string;
  readonly type: string;
  readonly conversationId?: ObjectId;
  readonly channelId?: ObjectId;
  readonly createdAt: Date;
  readonly replyMessageId?: ObjectId;
  readonly participants: {
    userId: ObjectId;
    name: string;
  }[];
  readonly user: {
    _id: string;
    name: string;
    avatar: string;
  };
  readonly reacts?: {
    userId: ObjectId;
    typeReaction: number;
  }[];
  readonly tags?: ObjectId[];
  readonly manipulatedUserIds?: string[];
  readonly options?: {
    userIds: ObjectId[];
    name: string;
  }[];
  readonly deletedUserIds?: ObjectId[];
}

export interface IMessagesModel {
  readonly userId: string;
  readonly content: string;
  readonly tags?: ObjectId[];
  readonly replyMessageId?: ObjectId;
  readonly manipulatedUserIds?: string[];
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
  readonly conversationId?: string;
  readonly channelId?: string;
}

export class MessagesModel implements IMessagesModel {
  constructor(
    readonly userId: string,
    readonly content: string,
    readonly type: string,
    readonly conversationId?: string,
    readonly channelId?: string,
    readonly tags?: ObjectId[],
    readonly replyMessageId?: ObjectId,
    readonly manipulatedUserIds?: string[],
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

export interface ICreateTextMessageViewReq {
  readonly userId?: string;
  readonly manipulatedUserIds?: string[];
  readonly content: string;
  readonly type: typeMessage;
  conversationId?: string;
  channelId?: string;
}
export class CreateTextMessageViewReq implements ICreateTextMessageViewReq {
  constructor(
    readonly content: string,
    readonly type: typeMessage,
    conversationId?: string,
    channelId?: string,
    readonly userId?: string,
    readonly manipulatedUserIds?: string[],
  ) {}
}
