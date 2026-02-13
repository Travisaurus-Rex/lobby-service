/**
 * Environment Configuration
 */

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000", 10),
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};

export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
