import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notifications } from 'src/_schemas/notifications.schema';
import { NotificationsSchema } from 'src/_schemas/notifications.schema';
import {
  NotificationToken,
  NotificationTokenSchema,
} from 'src/_schemas/notification_tokens.schema';
import { NotificationRepository } from './notification.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notifications.name, schema: NotificationsSchema },
      { name: NotificationToken.name, schema: NotificationTokenSchema },
    ]),
  ],
  providers: [NotificationService, NotificationRepository],
  controllers: [NotificationController],
  exports: [NotificationService, NotificationRepository],
})
export class NotificationModule {}
