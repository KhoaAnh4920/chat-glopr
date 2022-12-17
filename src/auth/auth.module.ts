import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [
    AuthModule,
    UsersModule,
    // PassportModule,
    // JwtModule.register({
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '3600s' },
    // }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
