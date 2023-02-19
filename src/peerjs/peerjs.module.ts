import { Module } from '@nestjs/common';
import { PeerjsService } from './peerjs.service';

@Module({
  providers: [PeerjsService],
})
export class PeerjsModule {}
