import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserGender } from '../users/users.enum';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  userName: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  dob: Date;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: UserGender.FEMALE, enum: UserGender })
  gender: UserGender;

  @Prop()
  type: boolean;

  @Prop({ default: 0 })
  isActived: boolean;

  @Prop({ default: 0 })
  isDeleted: boolean;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
