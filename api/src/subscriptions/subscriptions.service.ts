import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CreateSubscriptionDto } from './dto/create-subscription.dto.js';
import { SubscriptionsRepository } from './subscriptions.repository.js';
import { BillingInterval } from '@src/contracts/subscriptions.types.js';
import { Subscription } from './subscription.entity.ts';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectPinoLogger(SubscriptionsService.name)
    private readonly logger: PinoLogger,
    private readonly repo: SubscriptionsRepository,
  ) {}

  async createSubscription(subs: CreateSubscriptionDto, userId: string) {
    this.logger.info('Returning in Subscription Service');
    try {
      const res = await this.repo.createSubscription({
        ...subs,
        userId,
      });
      return res;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === '23503') {
        throw new BadRequestException('The specified category does not exist.');
      }
      this.logger.error(`Error creating subscriptions: ${error}`);
      throw error;
    }
  }

  async getSubscriptions(userId: string): Promise<Array<Subscription>> {
    try {
      const res = await this.repo.getSubscriptions(userId);
      return res;
    } catch (error) {
      this.logger.error(`Error getting subscriptions: ${error}`);
      throw error;
    }
  }

  async deleteSubscription(subscriptionId: string, userId: string){
    this.logger.info('Deleting subscription in service')
    try {
      const findSub = await this.repo.deleteSubscriptionById(subscriptionId, userId);
      if (!findSub ){
        throw new NotFoundException(`Subscription with ID ${subscriptionId} was not found`)
      }
    } catch (error) {
      this.logger.error(`Error deleting subs : ${error}`)
      throw error;
    }
  }
}
