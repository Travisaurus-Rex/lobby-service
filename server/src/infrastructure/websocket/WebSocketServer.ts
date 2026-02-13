/**
 * WebSocketServer
 * Wrapper around ws library for WebSocket server
 */

import { WebSocketServer as WSServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { WebSocketMessage } from "../../core/types/events.types";

export class WebSocketServer {
  private wss: WSServer;
  private connections: Map<string, WebSocket> = new Map();

  constructor(port: number = 3000) {
    this.wss = new WSServer({ port });
  }

  /**
   * Register a handler for new connections
   */
  onConnection(
    handler: (
      ws: WebSocket,
      playerId: string,
      request: IncomingMessage,
    ) => void,
  ): void {
    this.wss.on("connection", (ws: WebSocket, request: IncomingMessage) => {
      // Extract player ID from query params (e.g., ws://localhost:3000?playerId=abc123)
      const url = new URL(request.url || "", `http://${request.headers.host}`);
      const playerId =
        url.searchParams.get("playerId") || this.generateTempId();

      this.connections.set(playerId, ws);

      ws.on("close", () => {
        this.connections.delete(playerId);
      });

      handler(ws, playerId, request);
    });
  }

  /**
   * Send a message to a specific player
   */
  sendToPlayer(playerId: string, message: WebSocketMessage): void {
    const ws = this.connections.get(playerId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  /**
   * Broadcast a message to multiple players
   */
  broadcast(playerIds: string[], message: WebSocketMessage): void {
    const payload = JSON.stringify(message);
    playerIds.forEach((playerId) => {
      const ws = this.connections.get(playerId);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    });
  }

  /**
   * Broadcast to all connected clients
   */
  broadcastAll(message: WebSocketMessage): void {
    const payload = JSON.stringify(message);
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  /**
   * Check if a player is connected
   */
  isConnected(playerId: string): boolean {
    const ws = this.connections.get(playerId);
    return ws !== undefined && ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get number of connected clients
   */
  getConnectionCount(): number {
    return this.connections.size;
  }

  /**
   * Close the server
   */
  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.wss.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  private generateTempId(): string {
    return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
