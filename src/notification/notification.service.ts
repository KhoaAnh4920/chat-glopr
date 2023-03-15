import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { AppError, ERROR_CODE } from 'src/shared/error';
//const serviceAccount = require('../../notification-chatglopr-firebase-adminsdk-9d2kh-96377844cc.json');

@Injectable()
export class NotificationService {
  constructor() {
    // For simplicity these credentials are just stored in the environment
    // However these should be stored in a key management system
    // process.env.FIREBASE_CREDENTIAL_JSON
    firebase.initializeApp({
      credential: firebase.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }

  public async sendNotification(payload: any): Promise<any> {
    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
      },
      token: payload.token,
    };
    try {
      const response = await firebase.messaging().send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.log('Error sending message:', error);
    }
  }
}
