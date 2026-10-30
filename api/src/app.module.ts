import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from '@thallesp/nestjs-better-auth';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SubscriptionsModule } from './subscriptions/subscriptions.module.js';
import { DatabaseModule } from './database/database.module.js';
import { CategoryModule } from './category/category.module.js';
import { auth } from './auth/auth.ts';
import { UserIdInterceptor } from './auth/user-id.interceptor.ts';

const isProd = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? (isProd ? 'info' : 'debug'),

        // request id: reuse the caller's, or make one
        genReqId: (req, res) => {
          const id = (req.headers['x-request-id'] as string) ?? randomUUID();
          res.setHeader('x-request-id', id);
          return id;
        },

        // never log secrets
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'res.headers["set-cookie"]',
            'req.body.password',
          ],
          censor: '[redacted]',
        },

        // skip noisy routes
        autoLogging: { ignore: (req) => req.url === '/health' },

        // pretty in dev, raw JSON in prod
        transport: isProd
          ? undefined
          : {
              target: 'pino-pretty',
              options: { singleLine: true, colorize: true },
            },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule.forRoot({ auth }),
    SubscriptionsModule,
    DatabaseModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: UserIdInterceptor },
  ],
})
export class AppModule {}
