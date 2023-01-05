import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from 'src/_schemas/conversation.schema';
// import { UsersModule } from 'src/users/users.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { ConversationRepository } from './conversation.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    // UsersModule,
    GatewayModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationRepository],
})
export class ConversationModule {}
