import { ObjectId, Types } from 'mongoose';

export interface IValidateIndividual {
  readonly conversationId?: string;
  readonly userName1?: string;
  readonly userName2?: string;
}

export interface ICreateIndividual {
  readonly _id?: string;
  readonly isExists?: boolean;
}

export interface IConversationModel {
  readonly _id?: string;
  readonly name?: string;
  readonly image?: string;
  readonly creatorid?: string;
  readonly lastMessageId?: string;
  readonly pinMessageIds?: string[];
  readonly members: string[];
  readonly type: boolean;
  readonly isJoinFromLink?: boolean;
}

export class ConversationModel implements IConversationModel {
  constructor(
    readonly members: string[],
    readonly type: boolean,
    readonly name?: string,
    readonly image?: string,
    readonly creatorid?: string,
    readonly lastMessageId?: string,
    readonly pinMessageIds?: string[],
    readonly isJoinFromLink?: boolean,
  ) {}
}

export interface IUpdateConversationViewReq {
  readonly id: string;
  readonly name?: string;
  readonly image?: string;
  readonly creatorid?: string;
  readonly lastMessageId?: string;
  readonly pinMessageIds?: string[];
  readonly members?: string[];
  readonly type?: boolean;
  readonly isJoinFromLink?: boolean;
}

export class UpdateConversationViewReq implements IUpdateConversationViewReq {
  constructor(
    readonly id: string,
    readonly name?: string,
    readonly image?: string,
    readonly creatorid?: string,
    readonly lastMessageId?: string,
    readonly pinMessageIds?: string[],
    readonly members?: string[],
    readonly type?: boolean,
    readonly isJoinFromLink?: boolean,
  ) {}
}

export interface IUpdateConversationModel {
  readonly id: string;
  readonly name?: string;
  readonly image?: string;
  readonly creatorid?: string;
  readonly lastMessageId?: string;
  readonly pinMessageIds?: string[];
  readonly members?: string[];
  readonly type?: boolean;
  readonly isJoinFromLink?: boolean;
}

export class UpdateConversationModel implements IUpdateConversationModel {
  constructor(
    readonly id: string,
    readonly name?: string,
    readonly image?: string,
    readonly creatorid?: string,
    readonly lastMessageId?: string,
    readonly pinMessageIds?: string[],
    readonly members?: string[],
    readonly type?: boolean,
    readonly isJoinFromLink?: boolean,
  ) {}
}
