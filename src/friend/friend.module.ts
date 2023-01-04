import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendSchema, Friend } from 'src/_schemas/friend.schema';
import { UsersModule } from 'src/users/users.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import {
  FriendRequest,
  FriendRequestSchema,
} from 'src/_schemas/friendRequest.schema';
import { FriendRepository } from './friend.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Friend.name, schema: FriendSchema },
      { name: FriendRequest.name, schema: FriendRequestSchema },
    ]),
    UsersModule,
    GatewayModule,
  ],
  controllers: [FriendController],
  providers: [FriendService, FriendRepository],
})
export class FriendModule {}
