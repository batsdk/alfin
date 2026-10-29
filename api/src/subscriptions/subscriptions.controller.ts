import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto.js';
import { SubscriptionsService } from './subscriptions.service.js';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    @InjectPinoLogger(SubscriptionsController.name)
    private readonly logger: PinoLogger,
    private readonly subsService: SubscriptionsService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('all')
  async getSubscriptions() {
    this.logger.info('Getting All subs');
    const result = await this.subsService.getSubscriptions();

    return result;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createSubscription(@Body() createSubscription: CreateSubscriptionDto) {
    this.logger.info('Request recieved');
    const res = await this.subsService.createSubscription(createSubscription);
    console.log(createSubscription);
    return res;
  }
}
