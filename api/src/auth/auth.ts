import 'dotenv/config'; // must be first: this file is evaluated before ConfigModule loads .env
import { betterAuth } from 'better-auth';
import { bearer } from 'better-auth/plugins';
import { Pool } from 'pg';

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL, max: 5 }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.WEB_ORIGIN!],
  emailAndPassword: { enabled: true, minPasswordLength: 10 },
  plugins: [bearer()], // lets mobile/API clients send Authorization: Bearer <token>
  session: {
    expiresIn: 60 * 60 * 24 * 14, // 14 days, in seconds
    updateAge: 60 * 60 * 24, // push the expiry forward at most once a day while the user is active
  },
});
