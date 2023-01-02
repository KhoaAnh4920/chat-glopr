import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Document, ObjectId } from 'mongoose';

export type FriendDocument = Friend & Document;

@Schema({ versionKey: false, timestamps: true })
export class Friend {
  @Prop({ ref: 'User', type: [SchemaTypes.ObjectId] })
  userIds: ObjectId[];
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
