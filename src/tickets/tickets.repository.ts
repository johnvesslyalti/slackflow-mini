import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TicketsRepository {
  constructor(private prisma: PrismaService) {}

  createFromRequest(requestId: string, agentId: string) {
    return this.prisma.ticket.create({
      data: {
        requestId,
        agentId,
        status: 'ACTIVE',
      },
    });
  }
}
