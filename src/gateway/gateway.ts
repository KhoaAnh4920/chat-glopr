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
    console.log(server);
    //Do stuffs
  }

  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log('Incoming Connection');
    socket.emit('connected', {});
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    console.log('handleDisconnect');
  }

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() userId: Types.ObjectId,
    @ConnectedSocket() client: Socket,
  ) {
    // add user to redis //
    client.join(userId.toString());
    this.cacheRepository.handleJoin(userId.toString());
  }
}