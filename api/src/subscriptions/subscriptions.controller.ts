import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Response,
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

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createSubscription(@Body() createSubscription: CreateSubscriptionDto) {
    this.logger.info('Request recieved');
    const res = await this.subsService.createSubscription(createSubscription);
    console.log(createSubscription);
    return res;
  }
}
