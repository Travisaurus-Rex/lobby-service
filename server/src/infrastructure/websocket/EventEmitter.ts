/**
 * EventEmitter
 * Event distribution for WebSocket events
 */

type EventHandler = (...args: any[]) => void | Promise<void>;

export class EventEmitter {
  private events: Map<string, EventHandler[]> = new Map();

  /**
   * Subscribe to an event
   */
  on(event: string, handler: EventHandler): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(handler);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, handler: EventHandler): void {
    const handlers = this.events.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Emit an event
   */
  async emit(event: string, ...args: any[]): Promise<void> {
    const handlers = this.events.get(event);
    if (handlers) {
      for (const handler of handlers) {
        await handler(...args);
      }
    }
  }

  /**
   * Subscribe to an event once
   */
  once(event: string, handler: EventHandler): void {
    const onceHandler = async (...args: any[]) => {
      this.off(event, onceHandler);
      await handler(...args);
    };
    this.on(event, onceHandler);
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }

  /**
   * Get listener count for an event
   */
  listenerCount(event: string): number {
    return this.events.get(event)?.length || 0;
  }
}
