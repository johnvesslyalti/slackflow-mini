import { Injectable } from '@nestjs/common';
import { SlaRepository } from './sla.repository';
import { SLAStatus } from '@prisma/client';

@Injectable()
export class SlaService {
  constructor(private slaRepository: SlaRepository) {}

  start(ticketId: string) {
    const DEFAULT_DURATION = 30 * 60;
    return this.slaRepository.createForTicket(ticketId, DEFAULT_DURATION);
  }

  async pause(ticketId: string) {
    const sla = await this.slaRepository.findByTicketId(ticketId);

    if (!sla || sla.status !== 'ACTIVE') return;

    await this.slaRepository.update(sla.id, {
      status: SLAStatus.PAUSED,
      pausedAt: new Date(),
    });
  }

  async resume(ticketId: string) {
    const sla = await this.slaRepository.findByTicketId(ticketId);

    if (!sla || sla.status !== 'PAUSED' || !sla.pausedAt) return;

    const pausedDuration = Date.now() - sla.pausedAt.getTime() / 1000;

    await this.slaRepository.update(sla.id, {
      status: SLAStatus.ACTIVE,
      pausedAt: null,
      totalPausedDuration: sla.totalPaused + Math.floor(pausedDuration),
    });
  }
}
