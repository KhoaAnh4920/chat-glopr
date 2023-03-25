import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes, Types } from 'mongoose';

export type RolesDocument = Roles & Document;

@Schema({ versionKey: false, timestamps: true })
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
