import { Module } from '@nestjs/common';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Participants,
  ParticipantsSchema,
} from 'src/_schemas/participants.schema';
// import { UsersModule } from 'src/users/users.module';
//import { GatewayModule } from 'src/gateway/gateway.module';
import { ParticipantsRepository } from './participants.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Participants.name, schema: ParticipantsSchema },
    ]),
    // UsersModule,
    // GatewayModule,
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService, ParticipantsRepository],
  exports: [ParticipantsRepository, ParticipantsService],
})
export class ParticipantsModule {}
