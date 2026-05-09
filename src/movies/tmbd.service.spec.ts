import { Test, TestingModule } from '@nestjs/testing';
import { TmbdService } from './tmbd.service';

describe('TmbdService', () => {
  let service: TmbdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TmbdService],
    }).compile();

    service = module.get<TmbdService>(TmbdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
