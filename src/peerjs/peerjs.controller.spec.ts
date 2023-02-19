import { Test, TestingModule } from '@nestjs/testing';
import { PeerjsController } from './peerjs.controller';

describe('PeerjsController', () => {
  let controller: PeerjsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeerjsController],
    }).compile();

    controller = module.get<PeerjsController>(PeerjsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
