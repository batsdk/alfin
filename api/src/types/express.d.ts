// src/types/express.d.ts
import type { UserSession } from '@thallesp/nestjs-better-auth';
declare module 'express-serve-static-core' {
  interface Request {
    session?: UserSession;
    userId?: string;
  }
}
