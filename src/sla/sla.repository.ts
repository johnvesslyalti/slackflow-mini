import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SlaRepository {
  constructor(private prisma: PrismaService) {}

  createForTicket(ticketId: string, duration: number) {
    return this.prisma.sLA.create({
      data: {
        ticketId,
        duration,
        status: 'ACTIVE',
        startedAt: new Date(),
      },
    });
  }

  findById(id: string) {
    return this.prisma.sLA.findUnique({
      where: { id },
    });
  }

  findByTicketId(ticketId: string) {
    return this.prisma.sLA.findUnique({
      where: { ticketId },
    });
  }

  findActive() {
    return this.prisma.sLA.findMany({
      where: { status: 'ACTIVE' },
    });
  }

  update(id: string, data: Prisma.SLAUpdateInput) {
    return this.prisma.sLA.update({
      where: { id },
      data,
    });
  }
}
