import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type FriendRequestDocument = FriendRequest & Document;

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
export class FriendRequest {
  _id: string;

  @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
  senderId: string;

  @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
  receiverId: string;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
