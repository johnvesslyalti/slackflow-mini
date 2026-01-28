import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TicketsService } from 'src/tickets/tickets.service';
import { RequestsRepository } from './requests.repository';
import { RequestStatus } from '@prisma/client';

@Injectable()
export class RequestsService {
  constructor(
    private prisma: PrismaService,
    private requestsRepo: RequestsRepository,
    private ticketsService: TicketsService,
  ) {}
  create(data: { customerId: string; title: string; description?: string }) {
    return this.requestsRepo.create(data);
  }

  async accept(requestId: string, agentId: string) {
    return this.prisma.$transaction(async (tx) => {
      const request = await this.requestsRepo.findById(requestId, tx);

      if (!request) {
        throw new Error('Request not found');
      }

      if (request.status !== RequestStatus.OPEN) {
        throw new Error('Request already accepted or closed');
      }

      await this.requestsRepo.markAccepted(requestId, agentId, tx);

      const ticket = await this.ticketsService.createFromRequest(
        requestId,
        agentId,
        tx,
      );

      return ticket;
    });
  }

  async resolve(requestId: string) {
    return this.prisma.$transaction(async (tx) => {
      const request = await this.requestsRepo.findById(requestId, tx);

      if (!request || request.status !== RequestStatus.ACCEPTED) {
        throw new Error('Request cannot be resolved');
      }

      await this.requestsRepo.close(requestId, tx);

      await this.ticketsService.resolveByRequestId(requestId, tx);
    });
  }
}
