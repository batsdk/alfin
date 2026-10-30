import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthedRequest } from './auth.types.ts';

/** For protected routes: always a string, or 401. */
export const CurrentUserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const userId = ctx.switchToHttp().getRequest<AuthedRequest>().userId;
    if (!userId) throw new UnauthorizedException();
    return userId;
  },
);

/** For @OptionalAuth() routes: string or undefined. */
export const OptionalUserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string | undefined =>
    ctx.switchToHttp().getRequest<AuthedRequest>().userId,
);
