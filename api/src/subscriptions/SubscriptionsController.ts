import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto.ts';
import { SubscriptionsService } from './subscriptions.service.ts';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    @InjectPinoLogger(SubscriptionsController.name)
    private readonly logger: PinoLogger,
    private readonly subsService: SubscriptionsService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createSubscription(@Body() createSubscription: CreateSubscriptionDto) {
    const res = await this.subsService.createSubscription(createSubscription);
    this.logger.info(createSubscription);
    return res;
  }
}
