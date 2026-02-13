/**
 * Redis Configuration
 */

import { env } from "./environment.config";

export const redisConfig = {
  url: env.REDIS_URL,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
};
