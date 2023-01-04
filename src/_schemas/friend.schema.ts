import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes, Types } from 'mongoose';

export type FriendDocument = Friend & Document;

@Schema({ versionKey: false, timestamps: true })
export class Friend {
  _id: Types.ObjectId;

  @Prop({ ref: 'User', type: [SchemaTypes.ObjectId] })
  userIds: ObjectId[];
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
