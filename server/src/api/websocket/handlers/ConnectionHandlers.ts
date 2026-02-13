/**
 * ConnectionHandlers
 * Handles connection and disconnection events
 */

import { WebSocket } from "ws";
import { LobbyService } from "../../../services/LobbyService";
import { AuthService } from "../../../services/AuthService";
import { ConnectionManager } from "../../../infrastructure/websocket/ConnectionManager";
import { ConsoleLogger } from "../../../utils/logger";
import { AuthGuestData } from "../../../core/types/player.types";
import { SERVER_EVENTS } from "../../../constants/events";
import { WebSocketMessage } from "../../../core/types/events.types";

export class ConnectionHandlers {
  constructor(
    private lobbyService: LobbyService,
    private authService: AuthService,
    private connectionManager: ConnectionManager,
    private logger: ConsoleLogger,
  ) {}

  /**
   * Handle new connection
   */
  handleConnect(ws: WebSocket, playerId: string): void {
    this.logger.info("Client connected", { playerId });

    // Send connection confirmation
    const connectionMsg: WebSocketMessage = {
      type: SERVER_EVENTS.CONNECTED,
      data: { playerId },
    };
    ws.send(JSON.stringify(connectionMsg));
  }

  /**
   * Handle AUTH_GUEST event
   */
  handleAuthGuest(ws: WebSocket, playerId: string, data: AuthGuestData): void {
    const auth = this.authService.authenticateGuest(data?.username);
    const response: WebSocketMessage = {
      type: SERVER_EVENTS.AUTH_SUCCESS,
      data: auth,
    };
    ws.send(JSON.stringify(response));
  }

  /**
   * Handle disconnection
   */
  async handleDisconnect(playerId: string): Promise<void> {
    this.logger.info("Client disconnected", { playerId });

    // Remove player from lobby if they were in one
    const lobbyId = this.connectionManager.getPlayerLobby(playerId);
    if (lobbyId) {
      try {
        const lobby = await this.lobbyService.leaveLobby(lobbyId, playerId);
        this.connectionManager.removePlayerLobby(playerId);

        if (lobby) {
          // Notify other players
          this.broadcastToLobby(lobbyId, {
            type: "PLAYER_LEFT",
            data: {
              lobbyId,
              playerId,
              lobby: lobby.toJSON(),
            },
          });
        }

        // Broadcast updated lobby list
        await this.broadcastLobbyList();
      } catch (error) {
        this.logger.error("Error handling disconnect", error as Error);
      }
    }

    // Remove connection
    this.connectionManager.removeConnection(playerId);
  }

  /**
   * Broadcast message to all players in a lobby
   */
  private broadcastToLobby(lobbyId: string, message: WebSocketMessage): void {
    const playerIds = this.connectionManager.getPlayersInLobby(lobbyId);
    this.connectionManager.broadcast(playerIds, message);
  }

  /**
   * Broadcast updated lobby list to all connected clients
   */
  private async broadcastLobbyList(): Promise<void> {
    try {
      const lobbies = await this.lobbyService.getAvailableLobbies();
      this.connectionManager.broadcastAll({
        type: SERVER_EVENTS.LOBBY_LIST_UPDATED,
        data: { lobbies: lobbies.map((l) => l.toJSON()) },
      });
    } catch (error) {
      this.logger.error("Error broadcasting lobby list", error as Error);
    }
  }
}
