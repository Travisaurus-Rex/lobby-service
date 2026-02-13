/**
 * AuthService
 * Handles authentication - currently guest-only, designed to extend to accounts later
 */

import { Player } from "../core/entities/Player";

export interface AuthResult {
  playerId: string;
  username: string;
  isGuest: boolean;
}

export class AuthService {
  /**
   * Authenticate a guest player (no credentials needed)
   * Returns player info to be used for connection
   */
  authenticateGuest(requestedUsername?: string): AuthResult {
    const playerId = this.generatePlayerId();
    const username = requestedUsername || Player.generateGuestUsername();

    // Validate username format
    try {
      new Player(playerId, username, true); // Will throw if invalid
    } catch (error) {
      throw new Error("Invalid username format");
    }

    return {
      playerId,
      username,
      isGuest: true,
    };
  }

  /**
   * Validate a player session (currently just checks format)
   * In the future, this would validate JWT tokens or session IDs
   */
  validateSession(playerId: string): boolean {
    // Basic format check
    return playerId.length > 0 && typeof playerId === "string";
  }

  /**
   * Generate a unique player ID
   */
  private generatePlayerId(): string {
    return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  // Future: OAuth, username/password auth would go here
  // async authenticateWithPassword(username: string, password: string): Promise<AuthResult>
  // async authenticateWithOAuth(provider: string, token: string): Promise<AuthResult>
}
