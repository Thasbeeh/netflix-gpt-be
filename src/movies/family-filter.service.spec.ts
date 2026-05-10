import { Test, TestingModule } from '@nestjs/testing';
import { FamilyFilterService } from './family-filter.service';

describe('FamilyFilterService', () => {
  let service: FamilyFilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FamilyFilterService],
    }).compile();

    service = module.get<FamilyFilterService>(FamilyFilterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
