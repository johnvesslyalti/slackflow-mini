import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { TicketsModule } from 'src/tickets/tickets.module';
import { RequestsRepository } from './requests.repository';
import { SlaService } from 'src/sla/sla.service';

@Module({
  imports: [TicketsModule],
  controllers: [RequestsController],
  providers: [RequestsService, RequestsRepository],
  exports: [RequestsService],
})
export class RequestsModule {}
