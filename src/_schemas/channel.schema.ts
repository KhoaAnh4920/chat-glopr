import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes, Types } from 'mongoose';

export type ChannelDocument = Channel & Document;

@Schema({ versionKey: false, timestamps: true })
export class Channel {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ ref: 'Conversation', type: SchemaTypes.ObjectId, required: true })
  conversationId: string;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
