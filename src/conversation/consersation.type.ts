import { ObjectId, Types } from 'mongoose';

export interface IValidateIndividual {
  readonly conversationId?: Types.ObjectId;
  readonly userName1?: string;
  readonly userName2?: string;
}

export interface ICreateIndividual {
  readonly _id?: Types.ObjectId;
  readonly isExists?: boolean;
}

export interface IConversationModel {
  readonly _id?: Types.ObjectId;
  readonly name?: string;
  readonly image?: string;
  readonly creatorid?: ObjectId;
  readonly lastMessageId?: ObjectId;
  readonly pinMessageIds?: ObjectId[];
  readonly members: ObjectId[];
  readonly type: boolean;
  readonly isJoinFromLink?: boolean;
}

export class ConversationModel implements IConversationModel {
  constructor(
    readonly members: ObjectId[],
    readonly type: boolean,
    readonly name?: string,
    readonly image?: string,
    readonly creatorid?: ObjectId,
    readonly lastMessageId?: ObjectId,
    readonly pinMessageIds?: ObjectId[],
    readonly isJoinFromLink?: boolean,
  ) {}
}

export interface IUpdateConversationViewReq {
  readonly id: Types.ObjectId;
  readonly name?: string;
  readonly image?: string;
  readonly creatorid?: ObjectId;
  readonly lastMessageId?: ObjectId;
  readonly pinMessageIds?: ObjectId[];
  readonly members?: ObjectId[];
  readonly type?: boolean;
  readonly isJoinFromLink?: boolean;
}

export class UpdateConversationViewReq implements IUpdateConversationViewReq {
  constructor(
    readonly id: Types.ObjectId,
    readonly name?: string,
    readonly image?: string,
    readonly creatorid?: ObjectId,
    readonly lastMessageId?: ObjectId,
    readonly pinMessageIds?: ObjectId[],
    readonly members?: ObjectId[],
    readonly type?: boolean,
    readonly isJoinFromLink?: boolean,
  ) {}
}

export interface IUpdateConversationModel {
  readonly id: Types.ObjectId;
  readonly name?: string;
  readonly image?: string;
  readonly creatorid?: ObjectId;
  readonly lastMessageId?: ObjectId;
  readonly pinMessageIds?: ObjectId[];
  readonly members?: ObjectId[];
  readonly type?: boolean;
  readonly isJoinFromLink?: boolean;
}

export class UpdateConversationModel implements IUpdateConversationModel {
  constructor(
    readonly id: Types.ObjectId,
    readonly name?: string,
    readonly image?: string,
    readonly creatorid?: ObjectId,
    readonly lastMessageId?: ObjectId,
    readonly pinMessageIds?: ObjectId[],
    readonly members?: ObjectId[],
    readonly type?: boolean,
    readonly isJoinFromLink?: boolean,
  ) {}
}
