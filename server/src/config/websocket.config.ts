/**
 * WebSocket Configuration
 */

import { env } from "./environment.config";

export const websocketConfig = {
  port: env.PORT,
  perMessageDeflate: false,
  clientTracking: true,
};
