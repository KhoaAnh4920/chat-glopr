import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { AppError, ERROR_CODE } from 'src/shared/error';
import {
  Participants,
  ParticipantsDocument,
} from 'src/_schemas/participants.schema';
import { ParticipantsModel } from './paticipants.type';
const ObjectId = require('mongoose').Types.ObjectId;

export class ParticipantsRepository {
  constructor(
    @InjectModel('Participants')
    private participantsModel: Model<ParticipantsDocument>,
  ) {}

  public async createParticipants(
    conversationId: ObjectId,
    userId: ObjectId,
    name: string,
  ): Promise<Participants> {
    const payload = new ParticipantsModel(conversationId, userId, name);
    return await this.participantsModel.create(payload);
  }

  public async updateLastViewOfConversation(conversationId, userId) {
    return this.participantsModel.updateOne(
      { conversationId, userId },
      { $set: { lastView: new Date() } },
    );
  }
}
