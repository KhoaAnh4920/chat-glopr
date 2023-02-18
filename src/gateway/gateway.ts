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

  @SubscribeMessage('join-conversation')
  handleJoinConversations(
    @ConnectedSocket() client: Socket,
    conversationId: string,
  ) {
    console.log('conversationId: ', conversationId);
    client.join(conversationId);
  }

  @SubscribeMessage('leave-conversation')
  handleLeaveConversations(
    @ConnectedSocket() client: Socket,
    conversationId: string,
  ) {
    console.log('conversationId: ', conversationId);
    client.leave(conversationId);
  }

  @SubscribeMessage('typing')
  handleOnTypingMessage(
    conversationId: string,
    userId: string,
    @ConnectedSocket() client: Socket,
    isTyping: boolean,
  ) {
    console.log('isTyping: ', isTyping);
    client.broadcast
      .to(conversationId)
      .emit('typing', conversationId, userId, isTyping);
  }

  @SubscribeMessage('get-user-online')
  handleGetUserOnline(userId: string, cb: (isOnline, lastLogin) => void) {
    const cachedUser = this.cacheRepository.getUserInCache(userId);

    if (cachedUser) {
      const { isOnline, lastLogin }: any = cachedUser;
      cb(isOnline, lastLogin);
    }
  }
}
