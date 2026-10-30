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
import { SubscriptionResponse } from './dto/subscription.response.ts';
import { CurrentUserId } from '@src/auth/current-user-id.decorator.js';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    @InjectPinoLogger(SubscriptionsController.name)
    private readonly logger: PinoLogger,
    private readonly subsService: SubscriptionsService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getSubscriptions(@CurrentUserId() userId: string) {
    this.logger.info('Getting All subs');
    const result = await this.subsService.getSubscriptions(userId);
    return result;
  }

  @Post()
  async createSubscription(
    @Body() createSubscription: CreateSubscriptionDto,
    @CurrentUserId() userId: string,
  ) {
    this.logger.info('Request recieved');
    const res = await this.subsService.createSubscription(createSubscription, userId);

    return new SubscriptionResponse({
      isSuccess: true,
      subscription: res,
    });

    //  @Get()
    //   list(@CurrentUserId() userId: string) {
    //     return this.service.list(userId);
    //   }

    // create(@Session() session: UserSession, @Body() dto: CreateSubscriptionDto) {
    //   return this.service.createSubscription(session.user.id, dto);
    // }
  }
}
