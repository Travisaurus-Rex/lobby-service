/**
 * Error Codes and Messages
 */

export const ERROR_CODES = {
  // Lobby errors
  LOBBY_NOT_FOUND: "LOBBY_NOT_FOUND",
  LOBBY_FULL: "LOBBY_FULL",
  LOBBY_STARTED: "LOBBY_STARTED",
  INVALID_LOBBY_CODE: "INVALID_LOBBY_CODE",

  // Player errors
  PLAYER_NOT_FOUND: "PLAYER_NOT_FOUND",
  PLAYER_ALREADY_IN_LOBBY: "PLAYER_ALREADY_IN_LOBBY",
  PLAYER_NOT_IN_LOBBY: "PLAYER_NOT_IN_LOBBY",
  INVALID_USERNAME: "INVALID_USERNAME",

  // Permission errors
  NOT_HOST: "NOT_HOST",
  CANNOT_KICK_HOST: "CANNOT_KICK_HOST",
  CANNOT_KICK_SELF: "CANNOT_KICK_SELF",

  // Game errors
  GAME_ALREADY_STARTED: "GAME_ALREADY_STARTED",
  NOT_ENOUGH_PLAYERS: "NOT_ENOUGH_PLAYERS",
  PLAYERS_NOT_READY: "PLAYERS_NOT_READY",

  // General errors
  INVALID_MESSAGE_FORMAT: "INVALID_MESSAGE_FORMAT",
  UNKNOWN_EVENT_TYPE: "UNKNOWN_EVENT_TYPE",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.LOBBY_NOT_FOUND]: "Lobby not found",
  [ERROR_CODES.LOBBY_FULL]: "Lobby is full",
  [ERROR_CODES.LOBBY_STARTED]: "Game already started",
  [ERROR_CODES.INVALID_LOBBY_CODE]: "Invalid lobby code",
  [ERROR_CODES.PLAYER_NOT_FOUND]: "Player not found",
  [ERROR_CODES.PLAYER_ALREADY_IN_LOBBY]: "Player already in lobby",
  [ERROR_CODES.PLAYER_NOT_IN_LOBBY]: "Player not in lobby",
  [ERROR_CODES.INVALID_USERNAME]: "Invalid username format",
  [ERROR_CODES.NOT_HOST]: "Only host can perform this action",
  [ERROR_CODES.CANNOT_KICK_HOST]: "Cannot kick the host",
  [ERROR_CODES.CANNOT_KICK_SELF]: "Host cannot kick themselves",
  [ERROR_CODES.GAME_ALREADY_STARTED]: "Game already started",
  [ERROR_CODES.NOT_ENOUGH_PLAYERS]: "Need at least 2 players to start",
  [ERROR_CODES.PLAYERS_NOT_READY]: "Not all players are ready",
  [ERROR_CODES.INVALID_MESSAGE_FORMAT]: "Invalid message format",
  [ERROR_CODES.UNKNOWN_EVENT_TYPE]: "Unknown event type",
  [ERROR_CODES.INTERNAL_ERROR]: "Internal server error",
};
