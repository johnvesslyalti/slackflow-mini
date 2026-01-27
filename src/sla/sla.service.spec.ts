import { Test, TestingModule } from '@nestjs/testing';
import { SlaService } from './sla.service';
import { SlaRepository } from './sla.repository';

describe('SlaService', () => {
  let service: SlaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlaService,
        { provide: SlaRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<SlaService>(SlaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
