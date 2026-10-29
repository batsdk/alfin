import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service.js';
import { SubscriptionsRepository } from './subscriptions.repository.js';
import { PgSubscriptionsRepository } from './pg-subscriptions.repository.js';
import { DatabaseModule } from '@src/database/database.module.js';
import { SubscriptionsController } from './subscriptions.controller.ts';

@Module({
  controllers: [SubscriptionsController],
  imports: [DatabaseModule],
  providers: [
    SubscriptionsService,
    { provide: SubscriptionsRepository, useClass: PgSubscriptionsRepository },
  ],
})
export class SubscriptionsModule {}
