/**
 * Centralized Error Handling
 */

import { ERROR_CODES, ERROR_MESSAGES } from "../constants/errors";

export class AppError extends Error {
  constructor(
    public code: string,
    message?: string,
    public statusCode: number = 400,
  ) {
    super(message || ERROR_MESSAGES[code] || "Unknown error");
    this.name = "AppError";
  }
}

export class ErrorHandler {
  /**
   * Create a standardized error response
   */
  static createErrorResponse(error: Error | AppError): {
    type: string;
    data: {
      message: string;
      code?: string;
    };
  } {
    if (error instanceof AppError) {
      return {
        type: "ERROR",
        data: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      type: "ERROR",
      data: {
        message: error.message || "Internal server error",
        code: ERROR_CODES.INTERNAL_ERROR,
      },
    };
  }

  /**
   * Log error with context
   */
  static logError(error: Error, context?: Record<string, any>): void {
    console.error("[ERROR]", {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }
}
