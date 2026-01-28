import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TicketStatus } from '@prisma/client';

@Injectable()
export class TicketsRepository {
  constructor(private prisma: PrismaService) {}

  createFromRequest(requestId: string, agentId: string) {
    return this.prisma.ticket.create({
      data: {
        requestId,
        agentId,
        status: TicketStatus.ACTIVE,
      },
    });
  }

  resolveByRequestId(requestId: string) {
    return this.prisma.ticket.update({
      where: { requestId },
      data: {
        status: TicketStatus.RESOLVED,
      },
    });
  }
}
