import { Controller, Patch, Param, Body } from '@nestjs/common';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Patch(':id/accept')
  accept(@Param('id') requestId: string, @Body('agentId') agentId: string) {
    return this.requestsService.accept(requestId, agentId);
  }

  @Patch(':id/resolve')
  resolve(@Param('id') requestId: string) {
    return this.requestsService.resolve(requestId);
  }
}
