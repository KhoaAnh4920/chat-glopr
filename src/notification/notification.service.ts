import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { DeleteFCMDto, NotificationDto } from './notification.type';
import { AppError, ERROR_CODE } from 'src/shared/error';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  // public async sendTestNotification() {
  //   const fcmToken =
  //     'eVZp0NSBTaqMvYzXqncYa2:APA91bF1KOkHwxjmrLiyTBtcKEUivSChT4P3mzwjQox2U7QJ7pAvl6_-bI1CHBeGHNWYpvLJcTtb9O2tQynbbwTCXGEeiXvz-qbC-KGFJUfBCspU1iJwzXCuAOFIYmdjjwRqbBy6OLof';

  //   // Thông tin nội dung thông báo
  //   const payload = {
  //     notification: {
  //       title: 'Test Notification',
  //       body: 'This is a test notification',
  //     },
  //   };

  //   try {
  //     // Gửi thông báo tới thiết bị giả lập
  //     const response = await admin.messaging().sendToDevice(fcmToken, payload);
  //     console.log('response: ', response.results);

  //     console.log(
  //       `Successfully sent notification: ${response.successCount} messages were sent.`,
  //     );
  //   } catch (error) {
  //     console.error('Error sending notification:', error);
  //   }
  // }

  public async addFcmToken(notiDto: NotificationDto, userId: string) {
    const tokenNoti = await this.notificationRepository.findOneNotiToken(
      notiDto,
      userId,
    );
    console.log('tokenNoti: ', tokenNoti);
    if (tokenNoti) throw new AppError(ERROR_CODE.FCM_EXISTS);
    // Save to database //
    return this.notificationRepository.createOne(notiDto, userId);
  }

  public async deleteFcmToken(notiDto: DeleteFCMDto, userId: string) {
    const tokenNoti = await this.notificationRepository.findOneNotiToken(
      notiDto,
      userId,
    );
    console.log('tokenNoti: ', tokenNoti);
    if (!tokenNoti) throw new AppError(ERROR_CODE.INVALID_TOKEN);
    // Save to database //
    this.notificationRepository.deleteFcmToken(notiDto, userId);
  }
}
