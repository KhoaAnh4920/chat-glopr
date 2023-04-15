import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type ParticipantsDocument = Participants & Document;

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
export class Participants {
  _id: string;

  @Prop({ ref: 'Conversation', type: SchemaTypes.ObjectId })
  conversationId: string;

  @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
  userId: string;

  @Prop()
  name: string;

  @Prop({ default: new Date() })
  lastView: Date;

  @Prop({
    type: [
      {
        channelId: { type: SchemaTypes.ObjectId },
        lastView: { type: Date },
      },
    ],
    default: [],
  })
  lastViewOfChannels: { channelId: string; lastView: Date }[];

  @Prop({ default: true })
  isNotify: boolean;
}

export const ParticipantsSchema = SchemaFactory.createForClass(Participants);
