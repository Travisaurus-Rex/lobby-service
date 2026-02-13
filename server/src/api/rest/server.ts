/**
 * Express REST Server (Optional)
 * Provides HTTP endpoints alongside WebSocket
 */

import express, { Express } from "express";
import { healthCheck } from "./routes/health";

export function createRestServer(port: number = 3001): Express {
  const app = express();

  app.use(express.json());

  // Health check endpoint
  app.get("/health", healthCheck);

  return app;
}
