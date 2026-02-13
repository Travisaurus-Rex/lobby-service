/**
 * Health Check Route
 */

import { Request, Response } from "express";

export function healthCheck(req: Request, res: Response): void {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
