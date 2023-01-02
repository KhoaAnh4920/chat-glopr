import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Document, ObjectId } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ versionKey: false, timestamps: true })
export class Message {
  @Prop({ ref: 'User', type: [SchemaTypes.ObjectId], required: true })
  userIds: ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ ref: 'User', type: [SchemaTypes.ObjectId], default: [] })
  tags: ObjectId[];

  @Prop({ type: [SchemaTypes.ObjectId] })
  replyMessageId: ObjectId;

  @Prop({ ref: 'User', type: [SchemaTypes.ObjectId], default: [] })
  manipulatedUserIds: ObjectId[];

  @Prop({
    required: true,
    enum: [
      'TEXT',
      'IMAGE',
      'STICKER',
      'VIDEO',
      'FILE',
      'HTML',
      'NOTIFY',
      'VOTE',
    ],
  })
  type: string;

  @Prop({
    type: [
      {
        userId: { type: SchemaTypes.ObjectId },
        typeReaction: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6] },
      },
    ],
    default: [],
  })
  reacts: {
    userId: ObjectId;
    typeReaction: number;
  }[];

  @Prop({
    type: [
      {
        userId: { type: SchemaTypes.ObjectId, default: [] },
        name: { type: String },
      },
    ],
    require: false,
  })
  options: {
    userIds: ObjectId[];
    name: string;
  }[];

  @Prop({ ref: 'User', type: [SchemaTypes.ObjectId], default: [] })
  deletedUserIds: ObjectId[];

  @Prop({ default: 0 })
  isDeleted: boolean;

  @Prop({ ref: 'Conversation', type: SchemaTypes.ObjectId, required: true })
  conversationId: ObjectId;

  @Prop({ ref: 'Channel', type: SchemaTypes.ObjectId, required: true })
  channelId: ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
