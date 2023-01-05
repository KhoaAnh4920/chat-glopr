import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppError, ERROR_CODE } from 'src/shared/error';
import { MessageDocument } from 'src/_schemas/message.schema';
const ObjectId = require('mongoose').Types.ObjectId;

export class MessagesRepository {
  constructor(
    @InjectModel('Message')
    private messageModel: Model<MessageDocument>,
  ) {}
}
