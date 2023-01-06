import { ObjectId, Types } from 'mongoose';

export interface IParticipantsModel {
  readonly conversationId: ObjectId;
  readonly userId: ObjectId;
  readonly name?: string;
  readonly lastView?: Date;
  readonly lastViewOfChannels?: { channelId: ObjectId; lastView: Date }[];
  readonly isNotify?: boolean;
}

export class ParticipantsModel implements IParticipantsModel {
  constructor(
    readonly conversationId: ObjectId,
    readonly userId: ObjectId,
    readonly name?: string,
    readonly lastView?: Date,
    readonly lastViewOfChannels?: { channelId: ObjectId; lastView: Date }[],
    readonly isNotify?: boolean,
  ) {}
}
