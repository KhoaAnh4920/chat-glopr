import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';

export type RolesDocument = Roles & Document;

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
export class Roles {
  _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ ref: 'Conversation', type: SchemaTypes.ObjectId, required: true })
  conversationId: string;

  @Prop({
    ref: 'User',
    type: [SchemaTypes.ObjectId],
    required: false,
    default: [],
  })
  userIds: string[];

  @Prop({ default: 0 })
  isDeleted: boolean;
}

export const RolesSchema = SchemaFactory.createForClass(Roles);
