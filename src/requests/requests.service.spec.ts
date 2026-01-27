import { Test, TestingModule } from '@nestjs/testing';
import { RequestsService } from './requests.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TicketsRepository } from 'src/tickets/tickets.repository';
import { RequestsRepository } from './requests.repository';
import { SlaService } from 'src/sla/sla.service';

describe('RequestsService', () => {
  let service: RequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        { provide: PrismaService, useValue: { $transaction: jest.fn() } },
        { provide: RequestsRepository, useValue: {} },
        { provide: TicketsRepository, useValue: {} },
        { provide: SlaService, useValue: {} },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
