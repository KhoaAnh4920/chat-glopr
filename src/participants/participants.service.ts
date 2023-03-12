import { Injectable } from '@nestjs/common';
import { IUserNickNameRes } from 'src/conversation/consersation.type';
import { ParticipantsDocument } from 'src/_schemas/participants.schema';
import { ParticipantsRepository } from './participants.repository';

@Injectable()
export class ParticipantsService {
  constructor(
    private readonly participantsRepository: ParticipantsRepository,
  ) {}

  public async updateLastViewOfConversation(
    conversationId: string,
    userId: string,
  ) {
    return this.participantsRepository.updateLastViewOfConversation(
      conversationId,
      userId,
    );
  }

  public async getListMemberOfConversation(
    conversationId: string,
  ): Promise<ParticipantsDocument[]> {
    const users =
      await this.participantsRepository.getListInfosByConversationId(
        conversationId,
      );
    return users;
  }

  public async getMemberOfConversation(
    conversationId: string,
    userId: string,
  ): Promise<IUserNickNameRes> {
    const users = await this.participantsRepository.getMemberOfConversation(
      conversationId,
      userId,
    );
    return users;
  }
}
