import { Injectable } from '@nestjs/common';
import { RequestsService } from '../requests/requests.service';

@Injectable()
export class SlackService {
  constructor(private readonly requestsService: RequestsService) {}

  handleCommand(payload: any) {
    return this.requestsService.create(payload);
  }
}
