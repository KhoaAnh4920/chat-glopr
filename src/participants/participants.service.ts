import { Injectable } from '@nestjs/common';
import { ParticipantsRepository } from './participants.repository';

@Injectable()
export class ParticipantsService {
  constructor(
    private readonly participantsRepository: ParticipantsRepository,
  ) {}

  public async updateLastViewOfConversation(conversationId, userId) {
    return this.participantsRepository.updateLastViewOfConversation(
      conversationId,
      userId,
    );
  }
}
