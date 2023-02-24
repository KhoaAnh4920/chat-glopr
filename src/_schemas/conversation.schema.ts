import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes, Types } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ versionKey: false, timestamps: true })
export class Conversation {
  _id: string;

  @Prop({ required: false, default: '' })
  name: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ ref: 'User', type: SchemaTypes.ObjectId, default: null })
  creatorId: string;

  @Prop({ ref: 'Message', type: SchemaTypes.ObjectId })
  lastMessageId: string;

  @Prop({ ref: 'Message', type: [SchemaTypes.ObjectId], default: [] })
  pinMessageIds: string[];

  @Prop({ ref: 'User', type: [SchemaTypes.ObjectId] })
  members: string[];

  @Prop({ default: 0, type: Boolean })
  type: boolean;

  @Prop({ default: 0, type: Boolean })
  isJoinFromLink: boolean;

  @Prop({ ref: 'User', type: [SchemaTypes.ObjectId], default: [] })
  deletedUserIds: string[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
