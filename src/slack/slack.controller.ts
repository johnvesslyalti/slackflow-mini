import { Controller, Post, Body } from '@nestjs/common';
import { SlackService } from './slack.service';

@Controller('slack')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post('command')
  handleCommand(@Body() body: any) {
    return this.slackService.handleCommand(body);
  }
}
