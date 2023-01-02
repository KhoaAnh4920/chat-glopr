import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Document, ObjectId } from 'mongoose';

export type ChannelDocument = Channel & Document;

@Schema({ versionKey: false, timestamps: true })
export class Channel {
  @Prop({ required: true })
  name: string;

  @Prop({ ref: 'Conversation', type: SchemaTypes.ObjectId, required: true })
  conversationId: ObjectId;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
