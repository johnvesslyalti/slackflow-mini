import { Controller, Post, Body } from '@nestjs/common';
import { SlackService } from './slack.service';
import { CreateRequestDto } from './slack.dto';

@Controller('slack')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post('command')
  handleCommand(@Body() body: CreateRequestDto) {
    return this.slackService.handleCommand(body);
  }
}
