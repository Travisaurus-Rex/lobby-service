/**
 * Input Validation Utilities
 */

import { PLAYER_LIMITS, LOBBY_LIMITS, CHAT_LIMITS } from "../constants/limits";

export class Validators {
  /**
   * Validate username format
   */
  static validateUsername(username: string): {
    valid: boolean;
    error?: string;
  } {
    if (!username || username.trim().length === 0) {
      return { valid: false, error: "Username cannot be empty" };
    }

    const trimmed = username.trim();

    if (trimmed.length < PLAYER_LIMITS.MIN_USERNAME_LENGTH) {
      return {
        valid: false,
        error: `Username must be at least ${PLAYER_LIMITS.MIN_USERNAME_LENGTH} characters`,
      };
    }

    if (trimmed.length > PLAYER_LIMITS.MAX_USERNAME_LENGTH) {
      return {
        valid: false,
        error: `Username must be ${PLAYER_LIMITS.MAX_USERNAME_LENGTH} characters or less`,
      };
    }

    // Alphanumeric, spaces, underscores, hyphens only
    const validPattern = /^[a-zA-Z0-9_\- ]+$/;
    if (!validPattern.test(trimmed)) {
      return {
        valid: false,
        error:
          "Username can only contain letters, numbers, spaces, underscores, and hyphens",
      };
    }

    return { valid: true };
  }

  /**
   * Validate max players count
   */
  static validateMaxPlayers(maxPlayers: number): {
    valid: boolean;
    error?: string;
  } {
    if (!Number.isInteger(maxPlayers)) {
      return { valid: false, error: "Max players must be an integer" };
    }

    if (maxPlayers < LOBBY_LIMITS.MIN_PLAYERS) {
      return {
        valid: false,
        error: `Max players must be at least ${LOBBY_LIMITS.MIN_PLAYERS}`,
      };
    }

    if (maxPlayers > LOBBY_LIMITS.MAX_PLAYERS) {
      return {
        valid: false,
        error: `Max players cannot exceed ${LOBBY_LIMITS.MAX_PLAYERS}`,
      };
    }

    return { valid: true };
  }

  /**
   * Validate chat message content
   */
  static validateMessageContent(content: string): {
    valid: boolean;
    error?: string;
  } {
    if (!content || content.trim().length === 0) {
      return { valid: false, error: "Message content cannot be empty" };
    }

    const trimmed = content.trim();

    if (trimmed.length > CHAT_LIMITS.MAX_MESSAGE_LENGTH) {
      return {
        valid: false,
        error: `Message content cannot exceed ${CHAT_LIMITS.MAX_MESSAGE_LENGTH} characters`,
      };
    }

    return { valid: true };
  }

  /**
   * Validate lobby code format
   */
  static validateLobbyCode(code: string): { valid: boolean; error?: string } {
    if (!code || code.length !== 6) {
      return { valid: false, error: "Lobby code must be 6 characters" };
    }

    const validPattern = /^[A-Z0-9]+$/;
    if (!validPattern.test(code)) {
      return { valid: false, error: "Invalid lobby code format" };
    }

    return { valid: true };
  }
}
