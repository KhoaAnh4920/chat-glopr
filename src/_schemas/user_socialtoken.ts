import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { UserGender } from '../users/users.enum';

export type UserSocialTokenDocument = UserSocialToken & Document;

@Schema({ versionKey: false, timestamps: true })
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

  @Prop({ ref: 'User', type: [SchemaTypes.ObjectId], default: '' })
  userId: string;
}

export const UserSocialTokenSchema =
  SchemaFactory.createForClass(UserSocialToken);
