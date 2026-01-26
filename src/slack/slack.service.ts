import { Injectable } from '@nestjs/common';
import { RequestsService } from '../requests/requests.service';
import { CreateRequestDto } from './slack.dto';

@Injectable()
export class SlackService {
  constructor(private readonly requestsService: RequestsService) {}

  handleCommand(payload: CreateRequestDto) {
    return this.requestsService.create(payload);
  }
}
