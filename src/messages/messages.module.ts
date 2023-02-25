import { Module, forwardRef } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/_schemas/message.schema';
// import { UsersModule } from 'src/users/users.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { MessagesRepository } from './message.repository';
import { ConversationModule } from 'src/conversation/conversation.module';
import { ParticipantsModule } from 'src/participants/participants.module';
import { UploadModule } from 'src/upload/upload.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    // UsersModule,
    GatewayModule,
    forwardRef(() => ConversationModule),
    ParticipantsModule,
    UploadModule,
    UsersModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
  exports: [MessagesModule, MessagesService, MessagesRepository],
})
export class MessagesModule {}
