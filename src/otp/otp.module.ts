import { DynamicModule, Global, Module } from '@nestjs/common';
import { OtpService } from './otp.service';

@Module({})
@Global()
export class OtpModule {
  static forRoot(): DynamicModule {
    return {
      providers: [OtpService],
      exports: [OtpService],
      module: OtpModule,
    };
  }
}
