import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes, Types } from 'mongoose';

export type FriendRequestDocument = FriendRequest & Document;

@Schema({ versionKey: false, timestamps: true })
export class FriendRequest {
  _id: Types.ObjectId;

  @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
  senderId: ObjectId;

  @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
  receiverId: ObjectId;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
