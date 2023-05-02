import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from 'src/_schemas/user.schema';
import { UsersRepository } from './users.repository';
import { OtpModule } from '../otp/otp.module';
import { MailModule } from '../mail/mail.module';
import {
  UserSocialToken,
  UserSocialTokenSchema,
} from 'src/_schemas/user_socialtoken';
import { NotificationModule } from 'src/notification/notification.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserSocialToken.name, schema: UserSocialTokenSchema },
    ]),
    OtpModule,
    MailModule,
    NotificationModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
