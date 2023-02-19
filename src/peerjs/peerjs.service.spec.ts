import { Test, TestingModule } from '@nestjs/testing';
import { PeerjsService } from './peerjs.service';

describe('PeerjsService', () => {
  let service: PeerjsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeerjsService],
    }).compile();

    service = module.get<PeerjsService>(PeerjsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
