import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type UserSocialTokenDocument = UserSocialToken & Document;

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
export class UserSocialToken {
  _id: string;

  @Prop({ required: true })
  socialId: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  accessToken: string;

  @Prop()
  refreshToken: string;

  @Prop({ default: 0 })
  isDeleted: boolean;

  @Prop({ ref: 'User', type: SchemaTypes.ObjectId, default: '' })
  userId: string;
}

export const UserSocialTokenSchema =
  SchemaFactory.createForClass(UserSocialToken);
