import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  async create(payload: any) {
    return this.prisma.request.create({
      data: {
        slackMessageId: payload?.trigger_id,
        channelId: payload?.channel_id,
        createdBy: payload?.user_id,
        status: 'OPEN',
      },
    });
  }
}
