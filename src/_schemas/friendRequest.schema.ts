import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Document, ObjectId } from 'mongoose';

export type FriendRequestDocument = FriendRequest & Document;

@Schema({ versionKey: false, timestamps: true })
export class FriendRequest {
  @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
  senderId: ObjectId;

  @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
  receiverId: ObjectId;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
