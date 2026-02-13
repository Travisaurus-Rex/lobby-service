/**
 * ConsoleLogger
 * Simple console-based logger for development
 */

export class ConsoleLogger {
  info(message: string, meta?: Record<string, any>): void {
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] [INFO] ${message}`,
      meta ? JSON.stringify(meta) : "",
    );
  }

  warn(message: string, meta?: Record<string, any>): void {
    const timestamp = new Date().toISOString();
    console.warn(
      `[${timestamp}] [WARN] ${message}`,
      meta ? JSON.stringify(meta) : "",
    );
  }

  error(message: string, error?: Error | Record<string, any>): void {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] ${message}`);
    if (error instanceof Error) {
      console.error(error.stack);
    } else if (error) {
      console.error(JSON.stringify(error));
    }
  }

  debug(message: string, meta?: Record<string, any>): void {
    if (process.env.NODE_ENV === "development") {
      const timestamp = new Date().toISOString();
      console.debug(
        `[${timestamp}] [DEBUG] ${message}`,
        meta ? JSON.stringify(meta) : "",
      );
    }
  }
}
