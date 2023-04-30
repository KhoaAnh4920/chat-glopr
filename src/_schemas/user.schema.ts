import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { UserGender } from '../users/users.enum';

export type UserDocument = User & Document;

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
export class User {
  @ApiProperty({ example: '63b27f12b7aa9e3ac3a71a7e' })
  _id: string;

  @ApiProperty()
  @Prop({ required: true })
  fullName: string;

  @ApiProperty()
  @Prop({ required: false, unique: true, sparse: true })
  userName: string;

  @ApiProperty()
  @Prop({ required: false, unique: true, sparse: true })
  phoneNumber: string;

  @ApiProperty()
  @Prop({ required: false, unique: true, sparse: true })
  email: string;

  @Prop({ required: false, default: null })
  password: string;

  @Prop({ default: null })
  dob: Date;

  @Prop({ default: null })
  lastLogin: Date;

  @ApiProperty()
  @Prop({
    default:
      'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
  })
  avatar: string;

  @ApiProperty()
  @Prop({ default: UserGender.FEMALE, enum: UserGender })
  gender: UserGender;

  @Prop({ default: 0 })
  isActived: boolean;

  @ApiProperty()
  @Prop({ default: 0 })
  isDeleted: boolean;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
