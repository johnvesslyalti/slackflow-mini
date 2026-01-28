import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TicketStatus, Prisma } from '@prisma/client';

@Injectable()
export class TicketsRepository {
  constructor(private prisma: PrismaService) {}

  createFromRequest(
    requestId: string,
    agentId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma;
    return prisma.ticket.create({
      data: {
        requestId,
        agentId,
        status: TicketStatus.ACTIVE,
      },
    });
  }

  resolveByRequestId(requestId: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prisma;
    return prisma.ticket.update({
      where: { requestId },
      data: {
        status: TicketStatus.RESOLVED,
      },
    });
  }
}
