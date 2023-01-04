import { IoAdapter } from '@nestjs/platform-socket.io';
// import { getRepository } from 'typeorm';
import { AuthenticatedSocket } from './gateway.type';
// import { Session, User } from '../utils/typeorm';
import * as cookieParser from 'cookie-parser';
import * as cookie from 'cookie';
import { plainToInstance } from 'class-transformer';
import { ServerOptions } from 'socket.io';

export class WebsocketAdapter extends IoAdapter {
  createIOServer(port: number, options?: any) {
    //const sessionRepository = getRepository(Session);
    const server = super.createIOServer(port, options);
    server.use(async (socket: AuthenticatedSocket, next) => {
      console.log('Inside Websocket Adapter');
      const { cookie: clientCookie } = socket.handshake.headers;
      console.log('clientCookie: ', clientCookie);
      if (!clientCookie) {
        console.log('Client has no cookies');
        return next(new Error('Not Authenticated. No cookies were sent'));
      }
      const { CHAT_APP_SESSION_ID } = cookie.parse(clientCookie);
      if (!CHAT_APP_SESSION_ID) {
        console.log('CHAT_APP_SESSION_ID DOES NOT EXIST');
        return next(new Error('Not Authenticated'));
      }
      const signedCookie = cookieParser.signedCookie(
        CHAT_APP_SESSION_ID,
        process.env.COOKIE_SECRET,
      );
      if (!signedCookie) return next(new Error('Error signing cookie'));
      console.log('signedCookie: ', signedCookie);
      // const sessionDB = await sessionRepository.findOne({ id: signedCookie });
      // if (!sessionDB) return next(new Error('No session found'));
      // const userFromJson = JSON.parse(sessionDB.json);
      // if (!userFromJson.passport || !userFromJson.passport.user)
      //   return next(new Error('Passport or User object does not exist.'));
      // const userDB = plainToInstance(
      //   User,
      //   JSON.parse(sessionDB.json).passport.user,
      // );
      // socket.user = userDB;
      console.log('Run last !!!');
      next();
    });
    console.log('Run return !!!');
    return server;
  }
}
