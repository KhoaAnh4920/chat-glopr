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
    userId1: string,
    userId2: string,
  ): Promise<Conversation | undefined> {
    return this.conversationModel.findOne({
      type: false,
      members: { $all: [userId1, userId2] },
    });
  }

  public async createConvesation(
    members: string[],
    type: boolean,
  ): Promise<Conversation> {
    const payload = new ConversationModel(members, type);
    return await this.conversationModel.create(payload);
  }

  async updateConversation(
    id,
    updateConversationDto,
  ): Promise<ConversationDocument> {
    return this.conversationModel
      .findByIdAndUpdate(id, updateConversationDto, { new: true })
      .exec();
  }
}
