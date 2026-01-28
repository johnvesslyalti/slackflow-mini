import { Injectable } from '@nestjs/common';
import { SlaRepository } from './sla.repository';
import { SLA, SlaStatus, Prisma } from '@prisma/client';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SlaService {
  constructor(private slaRepository: SlaRepository) {}

  start(ticketId: string, tx?: Prisma.TransactionClient) {
    const DEFAULT_DURATION = 30 * 60;
    return this.slaRepository.createForTicket(ticketId, DEFAULT_DURATION, tx);
  }

  async pause(ticketId: string) {
    const sla = await this.slaRepository.findByTicketId(ticketId);

    if (!sla || sla.status !== SlaStatus.ACTIVE) return;

    await this.slaRepository.update(sla.id, {
      status: SlaStatus.PAUSED,
      pausedAt: new Date(),
    });
  }

  async resume(ticketId: string) {
    const sla = await this.slaRepository.findByTicketId(ticketId);

    if (!sla || sla.status !== SlaStatus.PAUSED || !sla.pausedAt) return;

    const pausedDuration = (Date.now() - sla.pausedAt.getTime()) / 1000;

    await this.slaRepository.update(sla.id, {
      status: SlaStatus.ACTIVE,
      pausedAt: null,
      totalPaused: sla.totalPaused + Math.floor(pausedDuration),
    });
  }

  @Cron('*/1 * * * * *')
  async checkForBreaches() {
    const activeSlas = await this.slaRepository.findActive();

    for (const sla of activeSlas) {
      const elapsedSeconds = this.getElapsed(sla);

      if (elapsedSeconds >= sla.duration) {
        await this.slaRepository.update(sla.id, {
          status: SlaStatus.BREACHED,
          breachedAt: new Date(),
        });
      }
    }
  }

  private getElapsed(sla: SLA) {
    const now = sla.completedAt ? sla.completedAt.getTime() : Date.now();
    const started = sla.startedAt.getTime();
    const paused = sla.totalPaused * 1000;

    return Math.floor((now - started - paused) / 1000);
  }

  async breachCheck(slaId: string) {
    const sla = await this.slaRepository.findById(slaId);

    if (!sla || sla.status !== SlaStatus.ACTIVE) return;

    const elapsed = this.getElapsed(sla);

    if (elapsed >= sla.duration) {
      await this.slaRepository.update(slaId, {
        status: SlaStatus.BREACHED,
      });
    }
  }

  async completeByTicketId(ticketId: string, tx?: Prisma.TransactionClient) {
    const sla = await this.slaRepository.findByTicketId(ticketId, tx);

    if (!sla || sla.status !== SlaStatus.ACTIVE) return;

    await this.slaRepository.update(
      sla.id,
      {
        status: SlaStatus.COMPLETED,
        completedAt: new Date(),
      },
      tx,
    );
  }
}
