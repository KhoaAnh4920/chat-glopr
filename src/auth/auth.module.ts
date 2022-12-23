import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { LocalStrategy } from './strategies/local.strategy';
import { OtpModule } from '../otp/otp.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    AuthModule,
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      // signOptions: { expiresIn: '3600s' },
    }),
    OtpModule,
  ],
  providers: [AuthService, ConfigService, LocalStrategy, JwtStategy],
  controllers: [AuthController],
})
export class AuthModule {}
