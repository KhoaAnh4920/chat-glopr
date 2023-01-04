import { Module } from '@nestjs/common';
// import { ConversationsModule } from '../conversations/conversations.module';
// import { FriendsModule } from '../friends/friends.module';
// import { GroupModule } from '../groups/group.module';
// import { Services } from '../utils/constants';
import { MessagingGateway } from './gateway';

@Module({
  imports: [],
  providers: [MessagingGateway],
  exports: [MessagingGateway],
})
export class GatewayModule {}
