import { Controller, Patch, Param, Body } from '@nestjs/common';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Patch(':id/accept')
  accept(@Param('id') id: string, @Body('owner') owner: string) {
    return this.requestsService.accept(id, owner);
  }

  @Patch(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.requestsService.resolve(id);
  }
}
