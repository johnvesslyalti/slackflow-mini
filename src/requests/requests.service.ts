import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestStatus } from './request-status.enum';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  async create(payload: any) {
    return this.prisma.request.create({
      data: {
        slackMessageId: payload?.trigger_id,
        channelId: payload?.channel_id,
        createdBy: payload?.user_id,
        status: RequestStatus.OPEN,
      },
    });
  }

  async accept(id: string, owner: string) {
    const request = await this.prisma.request.findUnique({ where: { id } });

    if (!request || request.status !== RequestStatus.OPEN) {
      throw new BadRequestException('Request cannot be accepted');
    }

    return this.prisma.request.update({
      where: { id },
      data: {
        status: RequestStatus.ACCEPTED,
        owner,
      },
    });
  }

  async resolve(id: string) {
    const request = await this.prisma.request.findUnique({ where: { id } });

    if (!request || request.status !== RequestStatus.ACCEPTED) {
      throw new BadRequestException('Request cannot be resolved');
    }

    return this.prisma.request.update({
      where: { id },
      data: {
        status: RequestStatus.RESOLVED,
        resolvedAt: new Date(),
      },
    });
  }
}
