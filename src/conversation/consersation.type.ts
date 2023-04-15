import { FRIEND_STATUS } from 'src/friend/friend.enum';
import { IMessagesResponse } from 'src/messages/messages.type';

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
  readonly creatorId?: string;
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
    readonly creatorId?: string,
    readonly lastMessageId?: string,
    readonly pinMessageIds?: string[],
    readonly isJoinFromLink?: boolean,
  ) {}
}

export interface IUpdateConversationViewReq {
  readonly id: string;
  readonly name?: string;
  readonly image?: string;
  readonly creatorId?: string;
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
    readonly creatorId?: string,
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
  readonly creatorId?: string;
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
    readonly creatorId?: string,
    readonly lastMessageId?: string,
    readonly pinMessageIds?: string[],
    readonly members?: string[],
    readonly type?: boolean,
    readonly isJoinFromLink?: boolean,
  ) {}
}

export interface ResConverObjLayout {
  name: string;
  image: string | string[];
}

export interface ISummaryConversation {
  _id: string;
  avatar: string | string[];
  userId: string;
  friendStatus: FRIEND_STATUS;
  type: boolean;
  totalMembers: number;
  numberUnread: number;
  lastMessage: IMessagesResponse;
  isNotify: boolean;
  isJoinFromLink: false;
}

export interface IUserNickNameRes {
  _id: string;
  nickName: string;
  fullName: string;
  avatar: string;
}

export interface IRolesModel {
  readonly _id?: string;
  readonly name: string;
  readonly conversationId: string;
  readonly userIds?: string[];
}

export class RolesModel implements IRolesModel {
  constructor(
    // readonly _id: string,
    readonly name: string,
    readonly conversationId: string,
    readonly userIds?: string[],
  ) {}
}

export interface IPayloadRole {
  name: string;
  converId: string;
  userIds?: string[];
}
