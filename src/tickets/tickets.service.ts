import { Injectable } from '@nestjs/common';
import { TicketsRepository } from './tickets.repository';
import { SlaService } from 'src/sla/sla.service';

@Injectable()
export class TicketsService {
  constructor(
    private ticketRepository: TicketsRepository,
    private slaService: SlaService,
  ) {}

  async createFromRequest(requestId: string, agentId: string) {
    const ticket = await this.ticketRepository.createFromRequest(
      requestId,
      agentId,
    );

    await this.slaService.start(ticket.id);

    return ticket;
  }
}
