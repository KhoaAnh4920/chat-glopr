import { Types } from 'mongoose';

export interface IFriendRequestModel {
  readonly senderId: Types.ObjectId;
  readonly receiverId: Types.ObjectId;
}

export interface IFriendModel {
  readonly userIds: Types.ObjectId[];
}

export class FriendRequestModel implements IFriendRequestModel {
  constructor(
    readonly senderId: Types.ObjectId,
    readonly receiverId: Types.ObjectId,
  ) {}
}

export class FriendModel implements IFriendModel {
  constructor(readonly userIds: Types.ObjectId[]) {}
}

export interface IDeleteFriendRequestViewReq {
  readonly _id: string;
  readonly userId: string;
}
