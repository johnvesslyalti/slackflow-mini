import { Controller, Post, Body } from '@nestjs/common';
import { RequestsService } from 'src/requests/requests.service';
import {
  CreateRequestDto,
  AcceptRequestDto,
  ResolveRequestDto,
} from './slack.dto';

@Controller('slack')
export class SlackController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post('/request')
  async createRequest(@Body() body: CreateRequestDto) {
    return this.requestsService.create(body);
  }

  @Post('/accept')
  async acceptRequest(@Body() body: AcceptRequestDto) {
    const { requestId, agentId } = body;

    return this.requestsService.accept(requestId, agentId);
  }

  @Post('/resolve')
  async resolveRequest(@Body() body: ResolveRequestDto) {
    const { requestId } = body;

    return this.requestsService.resolve(requestId);
  }
}
