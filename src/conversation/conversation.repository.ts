import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppError, ERROR_CODE } from 'src/shared/error';
import { ConversationDocument } from 'src/_schemas/conversation.schema';
const ObjectId = require('mongoose').Types.ObjectId;

export class ConversationRepository {
  constructor(
    @InjectModel('Conversation')
    private friendModel: Model<ConversationDocument>,
  ) {}
}
