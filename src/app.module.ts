import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OtpModule } from './otp/otp.module';
import { CacheModule } from './shared/cache/cache.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { UploadModule } from './upload/upload.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.CHAT_DB),
    AuthModule,
    UsersModule,
    OtpModule.forRoot(),
    CacheModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const cacheOptions = configService.get('redis') || {};
        return cacheOptions;
      },
      inject: [ConfigService],
    }),
    MailModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
