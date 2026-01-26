import { Injectable } from '@nestjs/common';
import { SlaRepository } from './sla.repository';
import { SLA, SLAStatus } from '@prisma/client';
import { Cron } from '@nestjs/schedule';

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

  @Cron('*/1 * * * * *')
  async checkForBreaches() {
    const activeSlas = await this.slaRepository.findActive();

    for (const sla of activeSlas) {
      const elapsedSeconds = this.getElapsed(sla);

      if (elapsedSeconds >= sla.duration) {
        await this.slaRepository.update(sla.id, {
          status: SLAStatus.BREACHED,
          breachedAt: new Date(),
        });
      }
    }
  }

  private getElapsed(sla: SLA) {
    const now = Date.now();
    const started = sla.startedAt.getTime();
    const paused = sla.totalPaused * 1000;

    return Math.floor((now - started - paused) / 1000);
  }

  async breachCheck(slaId: string) {
    const sla = await this.slaRepository.findById(slaId);

    if (!sla || sla.status !== 'ACTIVE') return;

    const elapsed = this.getElapsed(sla);

    if (elapsed >= sla.duration) {
      await this.slaRepository.update(slaId, {
        status: SLAStatus.BREACHED,
      });
    }
  }
}
