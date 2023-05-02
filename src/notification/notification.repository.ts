import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationTokenDocument } from 'src/_schemas/notification_tokens.schema';
import { NotificationsDocument } from 'src/_schemas/notifications.schema';
import { DeleteFCMDto, NotificationDto } from './notification.type';
import { FcmStatus } from './notification.enum';

export class NotificationRepository {
  constructor(
    @InjectModel('Notifications')
    private notificationsModel: Model<NotificationsDocument>,

    @InjectModel('NotificationToken')
    private notificationTokenModel: Model<NotificationTokenDocument>,
  ) {}

  public async createOne(
    notiDto: NotificationDto,
    userId: string,
  ): Promise<any> {
    const createOne = await this.notificationTokenModel.create({
      fcm_token: notiDto.fcmToken,
      device_uuid: notiDto.deviceUuid,
      status: FcmStatus.ACTIVE,
      userId: userId,
    });
    return createOne;
  }

  public async deleteFcmToken(
    notiDto: DeleteFCMDto,
    userId: string,
  ): Promise<void> {
    const { deviceUuid } = notiDto;
    await this.notificationTokenModel
      .findOneAndUpdate(
        { device_uuid: deviceUuid, userId: userId, isDeleted: false },
        { isDeleted: true },
        { new: true },
      )
      .exec();
  }

  public async findOneNotiToken(
    notiDto: NotificationDto | DeleteFCMDto,
    userId: string,
  ): Promise<any> {
    return this.notificationTokenModel.findOne({
      device_uuid: notiDto.deviceUuid,
      userId: userId,
      delete: false,
    });
  }
}
