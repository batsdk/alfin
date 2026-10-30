import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { AuthedRequest } from './auth.types.ts';

@Injectable()
export class UserIdInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (ctx.getType() !== 'http') return next.handle();

    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    const userId = req.session?.user?.id;

    if (userId) {
      req.userId = userId;
      this.logger.assign({ userId }); // every log line in this request now carries userId
    }
    return next.handle();
  }
}
