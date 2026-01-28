import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, SlaStatus } from '@prisma/client';

@Injectable()
export class SlaRepository {
  constructor(private prisma: PrismaService) {}

  createForTicket(
    ticketId: string,
    duration: number,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma;
    return prisma.sLA.create({
      data: {
        ticketId,
        duration,
        status: SlaStatus.ACTIVE,
        startedAt: new Date(),
      },
    });
  }

  findById(id: string) {
    return this.prisma.sLA.findUnique({
      where: { id },
    });
  }

  findByTicketId(ticketId: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prisma;
    return prisma.sLA.findUnique({
      where: { ticketId },
    });
  }

  findActive() {
    return this.prisma.sLA.findMany({
      where: { status: SlaStatus.ACTIVE },
    });
  }

  update(
    id: string,
    data: Prisma.SLAUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma;
    return prisma.sLA.update({
      where: { id },
      data,
    });
  }
}
