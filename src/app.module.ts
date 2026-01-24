import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SlackModule } from './slack/slack.module';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [SlackModule, RequestsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
