/**
 * ChatHandlers
 * Handles all chat-related WebSocket events
 */

import { WebSocket } from "ws";
import { ChatService } from "../../../services/ChatService";
import { LobbyService } from "../../../services/LobbyService";
import { ConnectionManager } from "../../../infrastructure/websocket/ConnectionManager";
import { ConsoleLogger } from "../../../utils/logger";
import { SendMessageData } from "../../../core/types/chat.types";
import { SERVER_EVENTS } from "../../../constants/events";
import { WebSocketMessage } from "../../../core/types/events.types";

export class ChatHandlers {
  constructor(
    private chatService: ChatService,
    private lobbyService: LobbyService,
    private connectionManager: ConnectionManager,
    private logger: ConsoleLogger,
  ) {}

  /**
   * Handle SEND_MESSAGE event
   */
  async handleSendMessage(
    ws: WebSocket,
    playerId: string,
    data: SendMessageData,
  ): Promise<void> {
    const { lobbyId, content } = data;

    const lobby = await this.lobbyService.getLobby(lobbyId);
    if (!lobby) {
      throw new Error("Lobby not found");
    }

    const player = lobby.getPlayer(playerId);
    if (!player) {
      throw new Error("Player not in lobby");
    }

    const chatMessage = await this.chatService.sendMessage(
      lobbyId,
      playerId,
      player.getUsername,
      content,
    );

    // Broadcast to all players in lobby
    this.broadcastToLobby(lobbyId, {
      type: SERVER_EVENTS.CHAT_MESSAGE,
      data: chatMessage.toJSON(),
    });
  }

  /**
   * Send chat history to a player (called when they join)
   */
  async sendChatHistory(ws: WebSocket, lobbyId: string): Promise<void> {
    const chatHistory = await this.chatService.getChatHistory(lobbyId);
    const historyMsg: WebSocketMessage = {
      type: SERVER_EVENTS.CHAT_HISTORY,
      data: { messages: chatHistory.map((m) => m.toJSON()) },
    };
    ws.send(JSON.stringify(historyMsg));
  }

  /**
   * Broadcast message to all players in a lobby
   */
  private broadcastToLobby(lobbyId: string, message: WebSocketMessage): void {
    const playerIds = this.connectionManager.getPlayersInLobby(lobbyId);
    this.connectionManager.broadcast(playerIds, message);
  }
}
