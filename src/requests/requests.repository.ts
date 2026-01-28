import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestStatus } from '@prisma/client';

@Injectable()
export class RequestsRepository {
  constructor(private prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.request.findUnique({
      where: { id },
    });
  }

  create(data: { customerId: string; title: string; description?: string }) {
    return this.prisma.request.create({
      data: {
        ...data,
        status: RequestStatus.OPEN,
      },
    });
  }

  close(requestId: string) {
    return this.prisma.request.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.CLOSED,
      },
    });
  }

  markAccepted(requestId: string, agentId: string) {
    return this.prisma.request.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.ACCEPTED,
        agentId,
      },
    });
  }
}
