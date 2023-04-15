import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type FriendDocument = Friend & Document;

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
export class Friend {
  _id: string;

  @Prop({ ref: 'User', type: [SchemaTypes.ObjectId] })
  userIds: string[];
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
