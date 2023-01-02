import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Document, ObjectId } from 'mongoose';

export type ParticipantsDocument = Participants & Document;

@Schema({ versionKey: false, timestamps: true })
export class Participants {
  @Prop({ ref: 'Conversation', type: SchemaTypes.ObjectId })
  conversationId: ObjectId;

  @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
  userId: ObjectId;

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
  lastViewOfChannels: { channelId: ObjectId; lastView: Date }[];

  @Prop({ default: true })
  isNotify: boolean;
}

export const ParticipantsSchema = SchemaFactory.createForClass(Participants);
