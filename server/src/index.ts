/**
 * Main Server Entry Point
 * Wires up all services and starts the WebSocket server
 */

import { WebSocket } from "ws";
import {
  WebSocketServer,
  WebSocketMessage,
} from "./infrastructure/websocket/WebSocketServer";
import { InMemoryStateStore } from "./infrastructure/memory/InMemoryStateStore";
import { InMemoryChatStore } from "./infrastructure/memory/InMemoryChatStore";
import { LobbyService } from "./services/LobbyService";
import { ChatService } from "./services/ChatService";
import { AuthService } from "./services/AuthService";
import { ConsoleLogger } from "./utils/logger";

const PORT = 3000;

// Initialize infrastructure
const stateStore = new InMemoryStateStore();
const chatStore = new InMemoryChatStore();
const logger = new ConsoleLogger();

// Initialize services
const lobbyService = new LobbyService(stateStore);
const chatService = new ChatService(chatStore);
const authService = new AuthService();

// Track player connections
const playerConnections = new Map<string, string>(); // playerId -> lobbyId

// Initialize WebSocket server
const wsServer = new WebSocketServer(PORT);

wsServer.onConnection((ws: WebSocket, playerId: string, request) => {
  logger.info("Client connected", { playerId });

  // Send connection confirmation
  const connectionMsg: WebSocketMessage = {
    type: "CONNECTED",
    data: { playerId },
  };
  ws.send(JSON.stringify(connectionMsg));

  // Handle incoming messages
  ws.on("message", async (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString()) as WebSocketMessage;
      logger.info(`[${playerId}] Received: ${message.type}`, message.data);

      await handleMessage(ws, playerId, message);
    } catch (error) {
      logger.error(`[${playerId}] Error processing message`, error as Error);
      const errorMsg: WebSocketMessage = {
        type: "ERROR",
        data: {
          message:
            error instanceof Error ? error.message : "Invalid message format",
        },
      };
      ws.send(JSON.stringify(errorMsg));
    }
  });

  // Handle disconnect
  ws.on("close", async () => {
    logger.info("Client disconnected", { playerId });

    // Remove player from lobby if they were in one
    const lobbyId = playerConnections.get(playerId);
    if (lobbyId) {
      try {
        const lobby = await lobbyService.leaveLobby(lobbyId, playerId);
        playerConnections.delete(playerId);

        if (lobby) {
          // Notify other players
          broadcastToLobby(lobby.getId, {
            type: "PLAYER_LEFT",
            data: {
              lobbyId: lobby.getId,
              playerId,
              lobby: lobby.toJSON(),
            },
          });
        }
      } catch (error) {
        logger.error("Error handling disconnect", error as Error);
      }
    }
  });
});

/**
 * Handle incoming WebSocket messages
 */
async function handleMessage(
  ws: WebSocket,
  playerId: string,
  message: WebSocketMessage,
): Promise<void> {
  const { type, data } = message;

  try {
    logger.info(`[${playerId}] Handling: ${type}`);

    switch (type) {
      case "AUTH_GUEST": {
        const auth = authService.authenticateGuest(data?.username);
        const response: WebSocketMessage = {
          type: "AUTH_SUCCESS",
          data: auth,
        };
        ws.send(JSON.stringify(response));
        break;
      }

      case "CREATE_LOBBY": {
        const { username, maxPlayers, isPrivate } = data;
        const lobbyCode = isPrivate
          ? LobbyService.generateLobbyCode()
          : undefined;

        logger.info(`[${playerId}] Creating lobby`, {
          username,
          maxPlayers,
          isPrivate,
        });

        const lobby = await lobbyService.createLobby(
          playerId,
          username || "Host",
          maxPlayers || 4,
          isPrivate || false,
          lobbyCode,
        );

        playerConnections.set(playerId, lobby.getId);

        logger.info(`[${playerId}] Lobby created: ${lobby.getId}`);

        const response: WebSocketMessage = {
          type: "LOBBY_CREATED",
          data: lobby.toJSON(),
        };
        ws.send(JSON.stringify(response));

        // Broadcast updated lobby list
        broadcastLobbyList();
        break;
      }

      case "JOIN_LOBBY": {
        const { lobbyId, username, lobbyCode } = data;

        logger.info(`[${playerId}] Joining lobby: ${lobbyId}`, {
          username,
          lobbyCode,
        });

        const lobby = await lobbyService.joinLobby(
          lobbyId,
          playerId,
          username || "Player",
          lobbyCode,
        );

        playerConnections.set(playerId, lobbyId);

        logger.info(`[${playerId}] Successfully joined lobby: ${lobbyId}`);

        const response: WebSocketMessage = {
          type: "LOBBY_JOINED",
          data: lobby.toJSON(),
        };
        ws.send(JSON.stringify(response));

        // Notify other players in lobby
        broadcastToLobby(
          lobbyId,
          {
            type: "PLAYER_JOINED",
            data: {
              lobbyId,
              playerId,
              lobby: lobby.toJSON(),
            },
          },
          playerId,
        );

        // Send chat history to new player
        const chatHistory = await chatService.getChatHistory(lobbyId);
        const historyMsg: WebSocketMessage = {
          type: "CHAT_HISTORY",
          data: { messages: chatHistory.map((m) => m.toJSON()) },
        };
        ws.send(JSON.stringify(historyMsg));

        // Broadcast updated lobby list
        broadcastLobbyList();
        break;
      }

      case "LEAVE_LOBBY": {
        const { lobbyId } = data;
        const lobby = await lobbyService.leaveLobby(lobbyId, playerId);

        playerConnections.delete(playerId);

        const response: WebSocketMessage = {
          type: "LOBBY_LEFT",
          data: { lobbyId },
        };
        ws.send(JSON.stringify(response));

        if (lobby) {
          // Notify other players
          broadcastToLobby(lobbyId, {
            type: "PLAYER_LEFT",
            data: {
              lobbyId,
              playerId,
              lobby: lobby.toJSON(),
            },
          });
        }

        // Broadcast updated lobby list
        broadcastLobbyList();
        break;
      }

      case "TOGGLE_READY": {
        const { lobbyId } = data;
        const lobby = await lobbyService.toggleReady(lobbyId, playerId);

        broadcastToLobby(lobbyId, {
          type: "PLAYER_READY_CHANGED",
          data: {
            lobbyId,
            playerId,
            lobby: lobby.toJSON(),
          },
        });
        break;
      }

      case "START_GAME": {
        const { lobbyId } = data;
        const lobby = await lobbyService.startGame(lobbyId, playerId);

        broadcastToLobby(lobbyId, {
          type: "GAME_STARTED",
          data: {
            lobbyId,
            lobby: lobby.toJSON(),
          },
        });

        // Broadcast updated lobby list
        broadcastLobbyList();
        break;
      }

      case "KICK_PLAYER": {
        const { lobbyId, targetPlayerId } = data;
        const lobby = await lobbyService.kickPlayer(
          lobbyId,
          playerId,
          targetPlayerId,
        );

        // Notify kicked player
        wsServer.sendToPlayer(targetPlayerId, {
          type: "KICKED",
          data: { lobbyId },
        });

        playerConnections.delete(targetPlayerId);

        // Notify other players
        broadcastToLobby(lobbyId, {
          type: "PLAYER_KICKED",
          data: {
            lobbyId,
            playerId: targetPlayerId,
            lobby: lobby.toJSON(),
          },
        });
        break;
      }

      case "SEND_MESSAGE": {
        const { lobbyId, content } = data;
        const lobby = await lobbyService.getLobby(lobbyId);

        if (!lobby) {
          throw new Error("Lobby not found");
        }

        const player = lobby.getPlayer(playerId);
        if (!player) {
          throw new Error("Player not in lobby");
        }

        const chatMessage = await chatService.sendMessage(
          lobbyId,
          playerId,
          player.getUsername,
          content,
        );

        // Broadcast to all players in lobby
        broadcastToLobby(lobbyId, {
          type: "CHAT_MESSAGE",
          data: chatMessage.toJSON(),
        });
        break;
      }

      case "GET_LOBBY_LIST": {
        const lobbies = await lobbyService.getAvailableLobbies();
        const response: WebSocketMessage = {
          type: "LOBBY_LIST",
          data: { lobbies: lobbies.map((l) => l.toJSON()) },
        };
        ws.send(JSON.stringify(response));
        break;
      }

      default:
        logger.warn("Unknown message type", { type });
        const errorMsg: WebSocketMessage = {
          type: "ERROR",
          data: { message: `Unknown message type: ${type}` },
        };
        ws.send(JSON.stringify(errorMsg));
    }
  } catch (error) {
    logger.error(`Error handling ${type}`, error as Error);
    const errorMsg: WebSocketMessage = {
      type: "ERROR",
      data: {
        message:
          error instanceof Error ? error.message : "Internal server error",
        originalType: type,
      },
    };
    ws.send(JSON.stringify(errorMsg));
  }
}

/**
 * Broadcast a message to all players in a lobby
 */
function broadcastToLobby(
  lobbyId: string,
  message: WebSocketMessage,
  excludePlayerId?: string,
): void {
  const playerIds = Array.from(playerConnections.entries())
    .filter(([pid, lid]) => lid === lobbyId && pid !== excludePlayerId)
    .map(([pid]) => pid);

  wsServer.broadcast(playerIds, message);
}

/**
 * Broadcast updated lobby list to all connected clients
 */
async function broadcastLobbyList(): Promise<void> {
  try {
    const lobbies = await lobbyService.getAvailableLobbies();
    wsServer.broadcastAll({
      type: "LOBBY_LIST_UPDATED",
      data: { lobbies: lobbies.map((l) => l.toJSON()) },
    });
  } catch (error) {
    logger.error("Error broadcasting lobby list", error as Error);
  }
}

logger.info(`WebSocket server started on port ${PORT}`);
logger.info(`Connect with: ws://localhost:${PORT}?playerId=your_id`);
