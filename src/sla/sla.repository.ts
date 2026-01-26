import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

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

  findByTicketId(ticketId: string) {
    return this.prisma.sLA.findUnique({
      where: { ticketId },
    });
  }

  update(id: string, data: any) {
    return this.prisma.sLA.update({
      where: { id },
      data,
    });
  }
}
