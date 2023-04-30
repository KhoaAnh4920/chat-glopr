import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type ChannelDocument = Channel & Document;

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
export class Channel {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ ref: 'Conversation', type: SchemaTypes.ObjectId, required: true })
  conversationId: string;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
