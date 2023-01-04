import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes, Types } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ versionKey: false, timestamps: true })
export class Conversation {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
  creatorid: ObjectId;

  @Prop({ ref: 'Message', type: SchemaTypes.ObjectId })
  lastMessageId: ObjectId;

  @Prop({ ref: 'Message', type: [SchemaTypes.ObjectId], default: [] })
  pinMessageIds: ObjectId[];

  @Prop({ ref: 'User', type: [SchemaTypes.ObjectId] })
  members: ObjectId[];

  @Prop()
  type: boolean;

  @Prop({ default: 0, type: Boolean })
  isJoinFromLink: boolean;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
