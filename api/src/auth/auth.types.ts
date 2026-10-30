import type { UserSession } from '@thallesp/nestjs-better-auth';

export interface AuthedRequest {
  session?: UserSession | null;
  userId?: string;
}
