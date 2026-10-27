import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SubscriptionsModule } from './subscriptions/subscriptions.module.js';

@Module({
  imports: [SubscriptionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
