import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { TicketsModule } from 'src/tickets/tickets.module';
import { RequestsRepository } from './requests.repository';

@Module({
  imports: [TicketsModule],
  controllers: [RequestsController],
  providers: [RequestsService, RequestsRepository],
})
export class RequestsModule {}

