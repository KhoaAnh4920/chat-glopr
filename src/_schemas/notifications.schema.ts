import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { FcmStatus } from 'src/notification/notification.enum';

export type NotificationsDocument = Notifications & Document;
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
export class Notifications {
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: String, required: true })
  body: any;

  @Prop({ default: FcmStatus.ACTIVE, enum: FcmStatus })
  status: FcmStatus;

  @Prop({ default: 0 })
  isDeleted: boolean;

  @Prop({ ref: 'NotificationToken', type: SchemaTypes.ObjectId, default: '' })
  notification_token: string;
}

export const NotificationsSchema = SchemaFactory.createForClass(Notifications);
