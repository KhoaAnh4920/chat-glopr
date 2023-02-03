import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { UserGender } from '../users/users.enum';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User {
  _id: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: false, unique: true, lowercase: true })
  userName: string;

  @Prop({ required: false, unique: true })
  phoneNumber: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false, default: null })
  password: string;

  @Prop({ default: null })
  dob: Date;

  @Prop({
    default:
      'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
  })
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
