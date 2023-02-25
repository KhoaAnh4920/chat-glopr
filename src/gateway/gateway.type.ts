import { User } from 'src/_schemas/user.schema';
import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  user?: User;
}

export interface PayloadTyping {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}
