import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TicketsRepository } from 'src/tickets/tickets.repository';
import { RequestsRepository } from './requests.repository';
import { RequestStatus } from '@prisma/client';
import { SlaService } from 'src/sla/sla.service';

@Injectable()
export class RequestsService {
  constructor(
    private prisma: PrismaService,
    private requestsRepo: RequestsRepository,
    private ticketsRepo: TicketsRepository,
    private slaService: SlaService
  ) {}

  async accept(requestId: string, agentId: string) {
    return this.prisma.$transaction(async () => {
      const request = await this.requestsRepo.findById(requestId);

      if (!request) {
        throw new Error('Request not found');
      }

      if (request.status !== RequestStatus.OPEN) {
        throw new Error('Request already accepted or closed');
      }

      await this.requestsRepo.markAccepted(requestId, agentId);

      const ticket = await this.ticketsRepo.createFromRequest(
        requestId,
        agentId,
      );

      return ticket;
    });
  }

  async resolve(requestId: string) {
  return this.prisma.$transaction(async () => {
    const request = await this.requestsRepo.findById(requestId);

    if (!request || request.status !== RequestStatus.ACCEPTED) {
      throw new Error('Request cannot be resolved');
    }

    await this.requestsRepo.close(requestId);

    await this.ticketsRepo.resolveByRequestId(requestId);

    await this.slaService.completeByRequestId(requestId);
  });
}

}
