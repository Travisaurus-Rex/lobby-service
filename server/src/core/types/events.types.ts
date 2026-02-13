/**
 * WebSocket Event Types
 */

export interface WebSocketMessage<T = any> {
  type: string;
  data?: T;
}

// Client -> Server Events
export type ClientEventType =
  | "AUTH_GUEST"
  | "CREATE_LOBBY"
  | "JOIN_LOBBY"
  | "LEAVE_LOBBY"
  | "TOGGLE_READY"
  | "START_GAME"
  | "KICK_PLAYER"
  | "SEND_MESSAGE"
  | "GET_LOBBY_LIST";

// Server -> Client Events
export type ServerEventType =
  | "CONNECTED"
  | "AUTH_SUCCESS"
  | "LOBBY_CREATED"
  | "LOBBY_JOINED"
  | "LOBBY_LEFT"
  | "PLAYER_JOINED"
  | "PLAYER_LEFT"
  | "PLAYER_READY_CHANGED"
  | "PLAYER_KICKED"
  | "GAME_STARTED"
  | "CHAT_MESSAGE"
  | "CHAT_HISTORY"
  | "LOBBY_LIST"
  | "LOBBY_LIST_UPDATED"
  | "KICKED"
  | "ERROR";
