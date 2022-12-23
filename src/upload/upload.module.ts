import { Module } from '@nestjs/common';
import { UploadProvider } from './upload.provider';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
  providers: [UploadProvider, UploadService],
  exports: [UploadProvider, UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
