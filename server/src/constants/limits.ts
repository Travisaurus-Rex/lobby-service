/**
 * System Limits and Constraints
 */

export const LOBBY_LIMITS = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 10,
  DEFAULT_MAX_PLAYERS: 4,
} as const;

export const PLAYER_LIMITS = {
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
} as const;

export const CHAT_LIMITS = {
  MAX_MESSAGE_LENGTH: 500,
  HISTORY_WINDOW_SIZE: 20,
} as const;

export const CONNECTION_LIMITS = {
  PRESENCE_TIMEOUT_MS: 30000, // 30 seconds
  HOST_GRACE_PERIOD_MS: 30000, // 30 seconds
} as const;
