import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes } from 'mongoose';
import { FcmStatus } from 'src/notification/notification.enum';

export type NotificationTokenDocument = NotificationToken & Document;
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
export class NotificationToken {
  _id: string;

  @Prop({ required: true })
  fcm_token: string;

  @Prop({ required: true })
  device_uuid: string;

  @ApiProperty()
  @Prop({ default: FcmStatus.ACTIVE, enum: FcmStatus })
  status: FcmStatus;

  @Prop({ default: 0 })
  isDeleted: boolean;

  @Prop({ ref: 'User', type: SchemaTypes.ObjectId, default: '' })
  userId: string;
}

export const NotificationTokenSchema =
  SchemaFactory.createForClass(NotificationToken);
