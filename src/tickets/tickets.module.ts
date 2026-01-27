import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsRepository } from './tickets.repository';

import { SlaModule } from '../sla/sla.module';

@Module({
  imports: [SlaModule],
  providers: [TicketsService, TicketsRepository],
  exports: [TicketsService],
})
export class TicketsModule {}
