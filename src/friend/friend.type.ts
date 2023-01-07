import { Types } from 'mongoose';

export interface IFriendRequestModel {
  readonly senderId: string;
  readonly receiverId: string;
}

export interface IFriendList {
  readonly _id: string;
  readonly userName: string;
  readonly avatar?: string;
  readonly isOnline?: boolean;
  readonly lastLogin?: Date;
}

export interface IFriendModel {
  readonly userIds: string[];
}

export class FriendRequestModel implements IFriendRequestModel {
  constructor(readonly senderId: string, readonly receiverId: string) {}
}

export class FriendModel implements IFriendModel {
  constructor(readonly userIds: string[]) {}
}

export interface IDeleteFriendRequestViewReq {
  readonly _id: string;
  readonly userId: string;
}
