import { Module } from '@nestjs/common';
import { SlaService } from './sla.service';
import { SlaRepository } from './sla.repository';

@Module({
  providers: [SlaService, SlaRepository],
  exports: [SlaService],
})
export class SlaModule {}
