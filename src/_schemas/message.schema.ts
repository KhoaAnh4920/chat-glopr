import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({
  timestamps: true,
  toJSON: {
    versionKey: false,
    virtuals: true,
    transform: function (doc: unknown, ret: Record<string, unknown>) {
      const transformed = { ...ret };
      delete transformed._id;
      return transformed;
    },
  },
})
export class Message {
  _id: ObjectId;

  @Prop({ ref: 'User', type: SchemaTypes.ObjectId, required: true })
  userId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ ref: 'User', type: [SchemaTypes.ObjectId], default: [] })
  tags: string[];

  @Prop({ type: [SchemaTypes.ObjectId] })
  replyMessageId: string;

  @Prop({ ref: 'User', type: [SchemaTypes.ObjectId], default: [] })
  manipulatedUserIds: string[];

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
      'LINK',
    ],
  })
  type: string;

  @Prop({
    type: [
      {
        userId: { type: SchemaTypes.ObjectId },
        typeReaction: { type: String },
      },
    ],
    default: [],
  })
  reacts: {
    userId: string;
    typeReaction: string;
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
    userIds: string[];
    name: string;
  }[];

  @Prop({ ref: 'User', type: [SchemaTypes.ObjectId], default: [] })
  deletedUserIds: string[];

  @Prop({ default: 0 })
  isDeleted: boolean;

  @Prop({ ref: 'Conversation', type: SchemaTypes.ObjectId, required: false })
  conversationId: string;

  @Prop({ ref: 'Channel', type: SchemaTypes.ObjectId, required: false })
  channelId: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
