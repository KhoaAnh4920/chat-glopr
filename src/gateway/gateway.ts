import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CacheRepository } from '../shared/cache/cache.repository';
import { AuthenticatedSocket, PayloadTyping } from './gateway.type';

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
    const userId = socket.data.userId;
    if (userId) {
      this.cacheRepository.handleLeave(userId);
    }
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    // add user to redis //
    console.log('userId join: ', userId);
    client.data.userId = userId;
    console.log('client.user.userId: ', client.data.userId);
    client.join(userId.toString());
    this.cacheRepository.handleJoin(userId.toString());
  }

  @SubscribeMessage('join-conversation')
  handleJoinConversations(
    @MessageBody()
    conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('conversationId: ', conversationId);
    client.join(conversationId);
  }

  @SubscribeMessage('leave-conversation')
  handleLeaveConversations(
    @MessageBody()
    conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('conversationId: ', conversationId);
    client.leave(conversationId);
  }

  @SubscribeMessage('typing')
  handleOnTypingMessage(
    @MessageBody()
    data: PayloadTyping,
    @ConnectedSocket() client: Socket,
  ) {
    //console.log('check data: ', data);
    const { conversationId } = data;
    client.broadcast.to(conversationId).emit('typing', data);
  }

  @SubscribeMessage('get-user-online')
  async handleGetUserOnline(
    @MessageBody()
    userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const cachedUser = await this.cacheRepository.getUserInCache(userId);
    console.log('cachedUser: ', cachedUser);

    if (cachedUser) {
      const { isOnline, lastLogin }: any = cachedUser;
      client.emit('userOnlineStatus', { isOnline, lastLogin });
    }
  }
}
