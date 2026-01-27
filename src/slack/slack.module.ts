import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { RequestsModule } from '../requests/requests.module';

@Module({
  imports: [RequestsModule],
  controllers: [SlackController],
})
export class SlackModule {}
