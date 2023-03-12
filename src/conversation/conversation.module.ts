import { Module, forwardRef } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from 'src/_schemas/conversation.schema';
import { UsersModule } from 'src/users/users.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { ConversationRepository } from './conversation.repository';
import { ParticipantsModule } from 'src/participants/participants.module';
import { MessagesModule } from 'src/messages/messages.module';
import { FriendModule } from 'src/friend/friend.module';
import { Roles, RolesSchema } from 'src/_schemas/roles.schema';
import {
  Participants,
  ParticipantsSchema,
} from 'src/_schemas/participants.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Roles.name, schema: RolesSchema },
      { name: Participants.name, schema: ParticipantsSchema },
    ]),
    UsersModule,
    GatewayModule,
    ParticipantsModule,
    forwardRef(() => MessagesModule),
    forwardRef(() => FriendModule),
  ],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationRepository],
  exports: [ConversationModule, ConversationService, ConversationRepository],
})
export class ConversationModule {}
