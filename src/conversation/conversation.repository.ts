import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { AppError, ERROR_CODE } from 'src/shared/error';
import {
  Conversation,
  ConversationDocument,
} from 'src/_schemas/conversation.schema';
import { ConversationModel, IConversationModel } from './consersation.type';

export class ConversationRepository {
  constructor(
    @InjectModel('Conversation')
    private conversationModel: Model<ConversationDocument>,
  ) {}

  public async findOne(indentity): Promise<IConversationModel | undefined> {
    return this.conversationModel.findOne({
      _id: indentity,
    });
  }

  public async existsIndividualConversation(
    userId1: ObjectId,
    userId2: ObjectId,
  ): Promise<Conversation | undefined> {
    return this.conversationModel.findOne({
      type: false,
      members: { $all: [userId1, userId2] },
    });
  }

  public async createConvesation(
    members: ObjectId[],
    type: boolean,
  ): Promise<Conversation> {
    const payload = new ConversationModel(members, type);
    return await this.conversationModel.create(payload);
  }

  async updateConversation(id, updateConversationDto): Promise<any> {
    return this.conversationModel
      .findByIdAndUpdate(id, updateConversationDto, { new: true })
      .exec();
  }
}
