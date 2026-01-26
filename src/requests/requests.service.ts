import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestStatus } from './request-status.enum';

@Injectable()
export class RequestsService {
  async accept(requestId: string, agentId: string) {
    
  }
}
