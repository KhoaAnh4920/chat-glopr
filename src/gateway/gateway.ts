import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from './gateway.type';
import { CacheRepository } from '../shared/cache/cache.repository';
import { SchemaTypes, Types } from 'mongoose';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly cacheRepository: CacheRepository) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Init socket server');
    //Do stuffs
  }

  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log('Incoming Connection');
    socket.emit('connected', {});
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    console.log('handleDisconnect');
    const userId = socket.user._id;
    console.log('userId:', userId);
    if (userId) this.cacheRepository.handleLeave(userId);
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    // add user to redis //
    console.log('userId join: ', userId);
    client.join(userId.toString());
    this.cacheRepository.handleJoin(userId.toString());
  }
}
