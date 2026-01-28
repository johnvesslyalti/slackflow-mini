import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TicketsRepository } from './tickets.repository';
import { SlaService } from 'src/sla/sla.service';

@Injectable()
export class TicketsService {
  constructor(
    private ticketRepository: TicketsRepository,
    private slaService: SlaService,
  ) {}

  async createFromRequest(
    requestId: string,
    agentId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const ticket = await this.ticketRepository.createFromRequest(
      requestId,
      agentId,
      tx,
    );

    await this.slaService.start(ticket.id, tx);

    return ticket;
  }

  async resolveByRequestId(requestId: string, tx?: Prisma.TransactionClient) {
    const ticket = await this.ticketRepository.resolveByRequestId(
      requestId,
      tx,
    );
    await this.slaService.completeByTicketId(ticket.id, tx);
  }
}
