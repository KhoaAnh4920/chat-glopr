import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/_schemas/message.schema';
// import { UsersModule } from 'src/users/users.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { MessagesRepository } from './message.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    // UsersModule,
    GatewayModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
})
export class MessagesModule {}
