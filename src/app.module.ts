import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SlackModule } from './slack/slack.module';
import { RequestsModule } from './requests/requests.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [SlackModule, RequestsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
