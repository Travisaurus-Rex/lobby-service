/**
 * ConnectionManager
 * Tracks which players are connected and which lobby they're in
 */

import { WebSocket } from "ws";

export class ConnectionManager {
  private connections: Map<string, WebSocket> = new Map();
  private playerLobbies: Map<string, string> = new Map(); // playerId -> lobbyId

  /**
   * Register a new connection
   */
  addConnection(playerId: string, ws: WebSocket): void {
    this.connections.set(playerId, ws);
  }

  /**
   * Remove a connection
   */
  removeConnection(playerId: string): void {
    this.connections.delete(playerId);
    this.playerLobbies.delete(playerId);
  }

  /**
   * Get WebSocket for a player
   */
  getConnection(playerId: string): WebSocket | undefined {
    return this.connections.get(playerId);
  }

  /**
   * Check if player is connected
   */
  isConnected(playerId: string): boolean {
    const ws = this.connections.get(playerId);
    return ws !== undefined && ws.readyState === WebSocket.OPEN;
  }

  /**
   * Associate a player with a lobby
   */
  setPlayerLobby(playerId: string, lobbyId: string): void {
    this.playerLobbies.set(playerId, lobbyId);
  }

  /**
   * Remove player from lobby tracking
   */
  removePlayerLobby(playerId: string): void {
    this.playerLobbies.delete(playerId);
  }

  /**
   * Get lobby ID for a player
   */
  getPlayerLobby(playerId: string): string | undefined {
    return this.playerLobbies.get(playerId);
  }

  /**
   * Get all players in a specific lobby
   */
  getPlayersInLobby(lobbyId: string): string[] {
    const players: string[] = [];
    for (const [playerId, playerLobbyId] of this.playerLobbies.entries()) {
      if (playerLobbyId === lobbyId) {
        players.push(playerId);
      }
    }
    return players;
  }

  /**
   * Get total connection count
   */
  getConnectionCount(): number {
    return this.connections.size;
  }

  /**
   * Send message to a specific player
   */
  sendToPlayer(playerId: string, message: any): void {
    const ws = this.connections.get(playerId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  /**
   * Broadcast message to multiple players
   */
  broadcast(playerIds: string[], message: any): void {
    const payload = JSON.stringify(message);
    playerIds.forEach((playerId) => {
      const ws = this.connections.get(playerId);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    });
  }

  /**
   * Broadcast to all connected players
   */
  broadcastAll(message: any): void {
    const payload = JSON.stringify(message);
    this.connections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    });
  }
}
